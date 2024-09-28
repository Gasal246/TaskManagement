import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Projects from "@/models/projectCollection";
import { sendNotification } from "../../helpers/notification-helper";
import Users from "@/models/userCollection";

import { getPusherInstance } from '@/lib/pusher/server';
import ProjectComments from "@/models/projectComments";
const pusherServer = getPusherInstance();

connectDB();

interface Body {
    projectid: string;
    comment: string;
    [key: string]: any;
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) return new NextResponse("Un Authorized Access", { status: 401 });

        const formData = await req.formData();
        const body = Object.fromEntries(formData) as Body;

        const user = await Users.findById(session?.user?.id, { Email: 1 });
        const project = await Projects.findById(body?.projectid, { Title: 1, AccessTo: 1 });

        const newComment = new ProjectComments({
            Comment: body?.comment,
            Creator: session?.user?.id
        })
        const savedComment = await newComment.save();
        const updatedProject = await Projects.findByIdAndUpdate(body?.projectid, { $push: { Comments: savedComment?._id } }, { new: true });
        const notificationPromises = project?.AccessTo?.map(async (userid: string) => {
            await sendNotification("Project Comment", `${user?.Email} commented on project "${project?.Title}"`, session?.user?.id, userid, 'project-comment')
        })
        await Promise.all(notificationPromises);
        await pusherServer.trigger(`channel-${body?.projectid}`, 'comment', {}); // realtime comment box...
        return Response.json(updatedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";