import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Projects from "@/models/projectCollection";
import ProjectComments from "@/models/projectComments";

connectDB();
export async function POST(req: NextRequest){
    try {
        const session:any = await getServerSession(authOptions);
        if(!session) return new NextResponse("Un Authorized Access", { status: 401 });
        
        const { projectid, commentid } = await req.json();
        const updatedProject = await Projects.findByIdAndUpdate(projectid, { $pull: { Comments: { _id: commentid }}}, { new: true });
        const removedComment = await ProjectComments.findByIdAndDelete(commentid);
        return Response.json(updatedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";