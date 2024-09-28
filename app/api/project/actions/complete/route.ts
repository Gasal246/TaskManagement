import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendNotification } from "@/app/api/helpers/notification-helper";
import connectDB from "@/lib/mongo";
import Departments from "@/models/departmentsCollection";
import Projects from "@/models/projectCollection";
import ProjectFlows from "@/models/projectFlowsCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

connectDB();
interface Body {
    projectid: string;
    workingDepartment: string;
    forwardDep?: string;
    flowDescription: string;
    [key: string]: any;
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) return new NextResponse("Un Authorized Access", { status: 401 });

        const formData = await req.formData();
        const body = Object.fromEntries(formData) as Body;
        const workingDep = await Departments.findById(body?.workingDepartment);
        const project = await Projects.findById(body?.projectid, { Title: 1, AccessTo: 1 })
        if (body?.forwardDep) {
            const forwardedDep = await Departments.findById(body?.forwardDep);
            const newFlow = new ProjectFlows({
                Title: "Project Completed And Forwarded",
                Description: `Project Marked Completed by ${workingDep?.DepartmentName} & forwarded to ${forwardedDep?.DepartmentName}.`,
                Creator: session?.user?.id,
                Status: 'complete'
            })
            const savedFlow = await newFlow.save();
            const notificationPromises = project?.AccessTo?.map(async (userid: string) => {
                await sendNotification('Project Complete and Forwarded', `Project "${project?.Title}" Marked Completed by ${workingDep?.DepartmentName} & forwarded to ${forwardedDep?.DepartmentName}.`, session?.user?.id, userid, 'project-forwarded');
            })
            await Promise.all(notificationPromises);
            const updatedProject = await Projects.findByIdAndUpdate(body?.projectid, { $push: { Flows: savedFlow } }, { new: true });
            return Response.json(updatedProject);
        }
        const newFlow = new ProjectFlows({
            Title: "Project Marked Completed",
            Description: `Project has been completed by ${workingDep?.DepartmentName}.`,
            Creator: session?.user?.id,
            Status: 'complete'
        })
        const savedFlow = await newFlow.save();
        const notificationPromises = project?.AccessTo?.map(async (userid: string) => {
            await sendNotification('Project Marked Completed', `Project "${project?.Title}" has been completed by ${workingDep?.DepartmentName}.`, session?.user?.id, userid, 'project-completion');
        })
        await Promise.all(notificationPromises);
        const updatedProject = await Projects.findByIdAndUpdate(body?.projectid, { $push: { Flows: savedFlow } }, { new: true });
        return Response.json(updatedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";