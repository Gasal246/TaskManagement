import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import ProjectFlows from "@/models/projectFlowsCollection";
import Projects from "@/models/projectCollection";
import { sendNotification } from "../../helpers/notification-helper";
import Users from "@/models/userCollection";
import Departments from "@/models/departmentsCollection";
import ProjectDepartments from "@/models/projectDepartments";

connectDB();

interface Body {
    title: string;
    description: string;
    deadline: string;
    priority: string;
    depId: string;
    clientId: string;
    [key: string]: any;
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) return new NextResponse("Un Authorized Access", { status: 401 });

        const formData = await req.formData();
        const body = Object.fromEntries(formData) as Body;
        const user = await Users.findById(session?.user?.id, { Email: 1, AvatarUrl: 1, Role: 1, Department: 1, Area: 1, Region: 1, Addedby: 1 })
            .populate({
                path: "Department",
                select: { DepartmentName: 1, DepartmentHead: 1 }
            })
            .populate({
                path: "Area",
                select: { AreaHead: 1 }
            })
            .populate({
                path: "Region",
                select: { RegionHead: 1 }
            });
        const dep = await Departments.findById(body?.depId, { DepartmentHead: 1 });

        let flow;
        if (user?.Role !== 'admin') {
            const newFlow = new ProjectFlows({
                Title: "Project Proposed",
                Description: "Initiated New Project Proposal, waiting for approval..",
                Status: 'complete',
                Creator: session?.user?.id
            })
            flow = await newFlow.save();
        }

        let depStaffs = user?.Role == 'admin' ? [] : [session?.user?.id]
        switch (user?.Role) {
            case 'admin': {
                depStaffs.push(dep?.DeparmtentHead); break;
            }
            case 'staff': {
                depStaffs.push(user?.Area?.AreaHead);
                depStaffs.push(user?.Region?.RegionHead);
                depStaffs.push(user?.Department?.DepartmentHead);
                break;
            }
            case 'area-head': {
                depStaffs.push(user?.Region?.RegionHead);
                depStaffs.push(user?.Department?.DepartmentHead);
                break;
            }
            case 'region-head': {
                depStaffs.push(user?.Department?.DepartmentHead);
                break;
            }
        }

        const projectDep = new ProjectDepartments({
            Depid: dep?._id,
            Staffs: depStaffs
        })
        const newProjDep = await projectDep.save();

        const projStaffs = user?.Role == 'admin' ? [session?.user?.id, ...depStaffs] : [user?.Addedby, ...depStaffs]
        const newProject = new Projects({
            Title: body?.title,
            Description: body?.description,
            AdminId: user?.Role === 'admin' ? user?._id : user?.Addedby,
            Creator: user?._id,
            WorkingDepartment: dep?._id,
            Departments: [newProjDep?._id],
            Area: user?.Role === 'admin' ? body?.area : user?.Area?._id,
            Region: user?.Role === 'admin' ? body?.region : user?.Region?._id,
            Deadline: body?.deadline || null,
            Priority: body?.priority,
            Flows: [flow?._id],
            IsApproved: user?.Role == 'admin',
            AccessTo: projStaffs,
            ClientId: body?.clientId || null
        })
        const savedProject = await newProject.save();
        await sendNotification("New Project Arrived", `A new Project from ${user?.Email}, ${user?.Role} of ${user?.Deparmtent?.DepartmentName} department. Waiting for your approval.`, user?._id, user?.Addedby, 'project-queued', savedProject?._id);
        return Response.json(savedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";