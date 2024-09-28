import connectDB from "@/lib/mongo";
import Tasks from "@/models/taskCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { userid: string }}){
    try {
        const searchParams: any = req.nextUrl.searchParams;
        const filter: TaskTypes = await searchParams.get('filter');

        let query = {}
        switch(filter){
            case 'new': 
                query = { ForwardList: params.userid, AcceptedBy: null }; break;
            case 'created':
                query = { Creator: params.userid }; break;
            case 'accepted':
                query = { AcceptedBy: params.userid }; break;
            case 'completed':
                query = { 'Activities.Completed': { $not: { $elemMatch: { $eq: false } } } }; break;
            default: 
                return new NextResponse("Invalid filter option", { status: 400 });
        }
        const tasks = await Tasks.find(query, {})
            .populate({
                path: "Creator",
                select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
            })
            .populate({
                path: "ProjectId",
                select: { Title: 1 }
            });
        const tasklist = tasks.map((task: any) => {
            const completed = task?.Activities?.some((activity: any) => activity?.Completed )
            return { ...task?._doc, Progress: ((completed / task?.Activities?.length) * 100) }
        })
        return Response.json(tasklist);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";