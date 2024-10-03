import connectDB from "@/lib/mongo";
import Tasks from "@/models/taskCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
    try {
        const tasks = await Tasks.find({ ForwardList: params?.userid });
        const completedTasks = tasks?.filter((task: any) => {
            const completedActivities = task?.Activities?.filter((activity: any) => activity?.Completed);
            return completedActivities?.length === task?.Activities?.length;
        });
        const unreadedTasks = tasks.filter((task: any) => (task?.ForwardList?.includes(params?.userid) && !task?.AcceptedBy));
        const createdTasks = tasks.filter((task: any) => task?.Creator == params.userid );
        const acceptedTasks = tasks.filter((task: any) => task?.AcceptedBy == params.userid);
        const result = {
            totalTasks: tasks.length,
            completedTasks: completedTasks?.length,
            unreadedTasks: unreadedTasks?.length,
            ownedTasks: createdTasks?.length,
            acceptedTasks: acceptedTasks?.length,
        }
        console.log(result)
        return Response.json(result);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 401 })
    }
}

export const dynamic = "force-dynamic";