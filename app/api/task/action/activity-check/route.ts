import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongo";
import Tasks from "@/models/taskCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

connectDB();

interface Body {
    activityid: string;
    taskid: string;
    status: boolean;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const formData = await req.formData();
        const { form } = Object.fromEntries(formData) as { form: string };
        const body = await JSON.parse(form) as Body;
        const task = await Tasks.findById(body?.taskid);
        const activity = task.Activities.id(body.activityid);
        activity.Completed = body.status;
        const updatedTask = await task.save();
        return Response.json(updatedTask);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";