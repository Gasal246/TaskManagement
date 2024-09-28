import connectDB from "@/lib/mongo";
import Clients from "@/models/clientCollection";
import Projects from "@/models/projectCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { id: string }}){
    try {
        const { searchParams } = new URL(req.url);
        const clientProjects = searchParams.get('clientprojects');
        const client = await Clients.findById(params.id)
            .populate({
                path: "Region",
                select: { RegionName: 1 }
            })
            .populate({
                path: "Area",
                select: { Areaname: 1 }
            })
            .populate({
                path: "AddedBy",
                select: { Name: 1, Email: 1, AvatarUrl: 1 }
            });
        let projects = [];
        if(clientProjects == '1'){
            projects = await Projects.find({ ClientId: params?.id }, { Title: 1, Description: 1, Creator: 1, ClientId: 1, Priority: 1, IsApproved: 1, createdAt: 1, Deadline: 1 })
                .populate({
                    path: "Creator",
                    select: { Name: 1, Email: 1, AvatarUrl: 1 }
                })
        }
        return Response.json({ ...client?._doc, Projects: projects });
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";