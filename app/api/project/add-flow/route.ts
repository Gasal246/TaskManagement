import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Projects from "@/models/projectCollection";
import ProjectFlows from "@/models/projectFlowsCollection";

connectDB();

interface Body {
    projectid: string;
    title: string;
    description: string;
    [key: string]: any;
}

export async function POST(req: NextRequest){
    try {
        const session:any = await getServerSession(authOptions);
        if(!session) return new NextResponse("Un Authorized Access", { status: 401 });

        const formData = await req.formData();
        const body = Object.fromEntries(formData) as Body;
        const newFlow = new ProjectFlows({
            Title: body?.title,
            Description: body?.description,
            Status: 'custom',
            Creator: session?.user?.id
        });
        const savedFlow = await newFlow.save();
        const updatedProject = await Projects.findByIdAndUpdate(body?.projectid, { $push: { Flows: savedFlow?._id }}, { new: true });
        return Response.json(updatedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";