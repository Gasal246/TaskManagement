import connectDB from "@/lib/mongo";
import Projects from "@/models/projectCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userid = searchParams.get('userid');
        const search = searchParams.get('search');

        if (!search || !userid) {
            return new NextResponse("No search term or Userid", { status: 502 })
        }
        const regex = new RegExp(search, 'i');

        const projects = await Projects.find({ Title: { $regex: regex }, AccessTo: userid })
            .populate({
                path: "Flows",
                select: { Status: 1 }
            })
            .populate({
                path: "Creator",
                select: { Email: 1, Name: 1, AvatarUrl: 1, Role: 1 }
            })
            .sort({ updatedAt: -1 });
        const projectlist = projects.map((project: any) => {
            let progress = 0;
            if (project?.IsApproved) { progress += 10; }
            if (project?.IsApproved && project?.WorkingDepartment) { progress += 60; }
            if (project?.Flows[project?.Flows?.length - 1]?.Status === 'completed') {
                progress += 30;
            } else if (project?.Flows[project?.Flows?.length - 1]?.Status === 'rollback') {
                progress -= 30;
            }
            return { ...project?._doc, Progress: progress }
        })
        return Response.json(projectlist)
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";