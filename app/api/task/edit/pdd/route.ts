// PDD means PRIORITY DESCRIPTION DEADLINE -- this file edit those variables of a task :D --

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongo";
import Tasks from "@/models/taskCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

connectDB();

interface Body {
    Description: string;
    Deadline: string;
    Priority: string;
    taskid: string;
}

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const formData = await req.formData();
        const { form } = Object.fromEntries(formData) as { form: string };
        const body = await JSON.parse(form) as Body;
        const updatedTask = await Tasks.findByIdAndUpdate(body?.taskid, { Description: body?.Description, Deadline: body?.Deadline, Priority: body?.Priority }, { new: true });
        return Response.json(updatedTask);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";