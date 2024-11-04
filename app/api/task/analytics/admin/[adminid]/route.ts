import connectDB from "@/lib/mongo";
import Tasks from "@/models/taskCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET ( req: NextRequest, { params }: { params: { adminid: string }} ) {
    try {
        const tasks = await Tasks.find({ AdminId: params.adminid });
        const ongoing = tasks?.filter((task: any) => task?.Status == 'pending' && task?.AcceptedBy );
        const newtasks = tasks?.filter((task: any) => task?.Status == 'new' && !task?.AcceptedBy );
        const completed = tasks?.filter(( task: any ) => task?.Status == 'completed');
        return Response.json({
            ongoing: ongoing,
            new: newtasks,
            completed: completed
        })
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";