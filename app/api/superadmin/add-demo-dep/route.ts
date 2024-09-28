import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";

connectDB();

interface Body {
    depName: string;
    maxCount: string;
    allowTasks: string;
    allowProjects: string;
    [key: string]: any; // For dynamic document properties
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Authorisation Error", { status: 401 })
        }
        const formdata = await req.formData();
        const body = Object.fromEntries(formdata) as Body;
        const newDep = new Departments({
            DepartmentName: body.depName,
            AllowProjects: body.allowProjects,
            AllowTasks: body.allowTasks,
            MaximumStaffs: body.maxCount,
            IsDemo: true
        })
        const savedDep = await newDep.save();
        return Response.json(savedDep);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic";
