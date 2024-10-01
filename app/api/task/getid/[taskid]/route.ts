import connectDB from "@/lib/mongo";
import Tasks from "@/models/taskCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { taskid: string }}){
    try {
        const task = await Tasks.findById(params.taskid)
            .populate({
                path: "Creator",
                select: { Name: 1, Email: 1, AvatarUrl: 1 }
            })
            .populate({
                path: "ProjectId",
                select: { Title: 1 }
            })
            .populate({
                path: "EnrolledBy",
                select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
            })
        return Response.json(task);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 })
    }
}

export const dynamic = "force-dynamic";