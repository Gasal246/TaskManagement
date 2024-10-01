import connectDB from "@/lib/mongo";
import Projects from "@/models/projectCollection";
import Tasks from "@/models/taskCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { projectid: string } }) {
    try {
        await Projects.find({}).limit(1);
        const tasks = await Tasks.find({ ProjectId: params.projectid })
            .populate({
                path: "Creator",
                select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
            })
            .populate({
                path: "ProjectId",
                select: { Title: 1 }
            });
        const tasklist = tasks.map((task: any) => {
            const completed = task?.Activities?.filter((activity: any) => activity?.Completed)
            return { ...task?._doc, Progress: ((completed.length / task?.Activities?.length) * 100) }
        })
        return Response.json(tasklist);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error");
    }
}

export const dynamic = "force-dynamic";
