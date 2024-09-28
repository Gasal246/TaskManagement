import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Projects from "@/models/projectCollection";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

connectDB();

interface Body {
    projectid: string;
    docid: string;
    accessArray: string
    [key: string]: any;
}

export async function POST(req: NextRequest){
    try {
        const session:any = await getServerSession(authOptions);
        if(!session) return new NextResponse("Un Authorized Access", { status: 401 });

        const formData = await req.formData();
        const body = Object.fromEntries(formData) as Body;
        const access = body?.accessArray?.split(',');
        const updatedProject = await Projects.updateOne({ _id: body?.projectid, 'Documents._id': body?.docid }, { $set: { 'Documents.$.AccessTo': access }}, { new: true });
        return Response.json(updatedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";