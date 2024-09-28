import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Projects from "@/models/projectCollection";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendNotification } from "@/app/api/helpers/notification-helper";
import Departments from "@/models/departmentsCollection";
import ProjectFlows from "@/models/projectFlowsCollection";

connectDB();
export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) return new NextResponse("Un Authorized Access", { status: 401 });

        const { projectid } = await req.json();
        const project = await Projects.findById(projectid, { AccessTo: 1, WorkingDepartment: 1 });
        const department = await Departments.findById(project?.WorkingDepartment, { DepartmentHead: 1 });
        let Accessto = project?.AccessTo
        if (!project?.AccessTo?.includes(department?.DepartmentHead)) {
            Accessto.push(department?.DepartmentHead);
        }
        const newFlow = new ProjectFlows({
            Title: "Project Approved",
            Description: "Project Has been approved by admin.",
            Status: 'complete',
            Creator: session?.user?.id
        })
        const savedFlow = await newFlow.save();
        const updatedProject = await Projects.findByIdAndUpdate(projectid, { IsApproved: true, AccessTo: Accessto, $push: { Flows: savedFlow } });
        const notificationPromises = updatedProject?.AccessTo?.map(async (userid: string) => {
            await sendNotification('Project Approved', `Project ${updatedProject?.Title} has been approved by admin. You can now find it on ongoing tab of projects and start working on it.`, session?.user?.id, userid, "project-approval")
        })
        await Promise.all(notificationPromises);
        return Response.json(updatedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";