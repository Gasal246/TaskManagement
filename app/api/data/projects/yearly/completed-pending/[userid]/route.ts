import { groupByMonth } from "@/app/api/helpers/project-analytics-helper";
import connectDB from "@/lib/mongo"
import Projects from "@/models/projectCollection";
import ProjectFlows from "@/models/projectFlowsCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params:{ userid: string }}){
    try {
        await ProjectFlows.find({}).limit(1);
        const projects = await Projects.find({ AccessTo: params.userid }).populate({
            path: "Flows"
        });
        const projectStatuses = [];
        for (const project of projects) {
            const createdAtMonth = new Date(project.createdAt).getMonth();
            let projectStatus = 'pending';

            project.Flows.forEach((flow: any) => {
                if (flow.Status === 'complete') {
                    projectStatus = 'completed';
                }
            });

            projectStatuses.push({
                date: project.createdAt,
                status: projectStatus
            });
        }
        const monthlyReport = await groupByMonth(projectStatuses);
        console.log(monthlyReport)
        return Response.json(monthlyReport);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic"
