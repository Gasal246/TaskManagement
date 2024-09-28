import connectDB from "@/lib/mongo";
import Tasks from "@/models/taskCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
    try {
        const tasks = await Tasks.find({ ForwardList: params?.userid });
        const completedTasks = tasks?.map((task: any) => {
            const notCompleted = task?.Activities?.some((activity: any) => !activity?.Completed )
            if(notCompleted?.length <= 0){
                return task
            }
        })
        const unreadedTasks = tasks.filter((task: any) => !task?.ForwardList?.includes(params?.userid))
        const result = {
            totalTasks: tasks.length,
            completedTasks: completedTasks?.length,
            unreadedTasks: unreadedTasks?.length
        }
        return Response.json(result);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 401 })
    }
}

export const dynamic = "force-dynamic";