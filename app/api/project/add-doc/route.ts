import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Projects from "@/models/projectCollection";

connectDB();

interface Body {
    projectid: string;
    docname: string;
    accessto: string;
    docurl: string;
    [key: string]: any;
}

export async function POST(req: NextRequest){
    try {
        const session:any = await getServerSession(authOptions);
        if(!session) return new NextResponse("Un Authorized Access", { status: 401 });

        const formData = await req.formData();
        const body = Object.fromEntries(formData) as Body;
        const access = body?.accessto?.split(',');
        const doc = {
            AccessTo: access,
            DocName: body?.docname,
            DocUrl: body?.docurl
        }
        const updatedProject = await Projects.findByIdAndUpdate(body?.projectid, { $push:{ Documents: doc } }, { new: true });
        return Response.json(updatedProject);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";