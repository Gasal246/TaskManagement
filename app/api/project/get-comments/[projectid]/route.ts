import { NextRequest, NextResponse } from "next/server";
import Projects from "@/models/projectCollection";
import connectDB from "@/lib/mongo";
import ProjectComments from "@/models/projectComments";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { projectid: string } }) {
    try {
        await ProjectComments.find({}).limit(1)
        const project = await Projects.findById(params.projectid, { AdminId: 1, Creator: 1, WorkingDepartment: 1, Comments: 1 })
            .populate({
                path: "Comments",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "Creator",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 },
                },
                
            })
        // console.log(project);
        return Response.json(project);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";