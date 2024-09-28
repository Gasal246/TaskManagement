import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Projects from "@/models/projectCollection";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendNotification } from "@/app/api/helpers/notification-helper";
import { formatDateTiny } from "@/lib/utils";

connectDB();
export async function POST(req: NextRequest){
    try {
        const session:any = await getServerSession(authOptions);
        if(!session) return new NextResponse("Un Authorized Access", { status: 401 });
        
        const { projectid, deadline } = await req.json();
        const updatedProject = await Projects.findByIdAndUpdate(projectid, { Deadline: deadline });
        const project = await Projects.findById(projectid, { AccessTo: 1, Title: 1 });
        const notificationPromises = project?.AccessTo?.map(async (userid: string) => {
            await sendNotification("Project Deadline Changed.", `Deadline for Project "${project?.Title}" have been changed. to ${formatDateTiny(deadline)}`, session?.user?.id, userid, 'project-deadline')
        })
        await Promise.all(notificationPromises);
        return Response.json(updatedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";