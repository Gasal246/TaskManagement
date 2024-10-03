import connectDB from "@/lib/mongo";
import Projects from "@/models/projectCollection";
import ProjectFlows from "@/models/projectFlowsCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userid = searchParams.get('userid');
        const filter = searchParams.get('filter') as ProjectGetFilters;

        if (!userid || !filter) {
            return new NextResponse("Bad Request", { status: 400 });
        }
        let query = {};
        await ProjectFlows.find({}).limit(1);
        switch (filter) {
            case 'all':
                query = { AccessTo: userid }; break;
            case 'new':
                query = { AccessTo: userid, IsApproved: false }; break;
            case 'ongoing':
                query = { AccessTo: userid, IsApproved: true, IsCompleted: false || null }; break;
            case 'owned':
                query = { Creator: userid }; break;
            case 'ended':
                query = { AccessTo: userid, IsCompleted: true }; break;
            case 'deleted':
                query = { AccessTo: userid, IsDeleted: true }; break;
            default:
                return new NextResponse("Invalid filter", { status: 400 });
        }

        const projects = await Projects.find(query)
            .populate({
                path: "Flows",
                select: { Status: 1 }
            })
            .populate({
                path: "Creator",
                select: { Email: 1, Name: 1, AvatarUrl: 1, Role: 1 }
            })
            .sort({ updatedAt: -1 }).exec();
        const projectlist = projects.map((project: any) => {
            let progress = 0;
            if(project?.IsApproved){ progress += 10; }
            if(project?.IsApproved && project?.WorkingDepartment){ progress += 60; }
            if(project?.Flows[project?.Flows?.length - 1]?.Status === 'completed'){ 
                progress += 30;
            }else if(project?.Flows[project?.Flows?.length - 1]?.Status === 'rollback'){
                progress -= 30;
            }
            return { ...project?._doc, Progress: progress }
        })
        // console.log("THE PROJECTS "+filter, projectlist);
        return Response.json(projectlist)
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";