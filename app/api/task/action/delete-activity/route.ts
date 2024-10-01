import connectDB from "@/lib/mongo";
import Tasks from "@/models/taskCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req:NextRequest) {
    try {
        const { taskid, activityid } = await req.json();
        const updatedTask = await Tasks.findByIdAndUpdate(taskid, { $pull: { Activities: { _id: activityid }} }, { new: true });
        return Response.json(updatedTask);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic";