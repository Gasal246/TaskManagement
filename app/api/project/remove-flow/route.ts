import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Projects from "@/models/projectCollection";
import ProjectFlows from "@/models/projectFlowsCollection";

connectDB();
export async function POST(req: NextRequest){
    try {
        const session:any = await getServerSession(authOptions);
        if(!session) return new NextResponse("Un Authorized Access", { status: 401 });
        
        const { projectid, flowid } = await req.json();
        const updatedProject = await Projects.findByIdAndUpdate(projectid, { $pull: { Flows: { _id: flowid }}}, { new: true });
        const removedFlow = await ProjectFlows.findByIdAndDelete(flowid);
        return Response.json(updatedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";