import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongo";
import Tasks from "@/models/taskCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req:NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const { taskid } = await req.json();
        const existing = await Tasks.findById(taskid, { EnrolledBy: 1 });
        if(existing?.EnrolledBy?.includes(session?.user?.id)){
            return Response.json({ existing: true })
        }
        const updatedTask = await Tasks.findByIdAndUpdate(taskid, { $push: { EnrolledBy: session?.user?.id }}, { new: true });
        return Response.json(updatedTask);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";