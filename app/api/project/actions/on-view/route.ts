import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Projects from "@/models/projectCollection";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

connectDB();
export async function POST(req: NextRequest){
    try {
        const session:any = await getServerSession(authOptions);
        if(!session) return new NextResponse("Un Authorized Access", { status: 401 });
        
        const { projectid } = await req.json();
        const existing = await Projects.findById(projectid, { OpenedBy: 1 });
        if(existing?.OpenedBy?.includes(session?.user?.id)){
            return Response.json({ existing: true })
        }
        const updatedProject = await Projects.findByIdAndUpdate(projectid, { $push: { OpenedBy: session?.user?.id }}, { new: true }); 
        return Response.json(updatedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";