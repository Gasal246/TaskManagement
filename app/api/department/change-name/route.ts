import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const { depId, newName } = await req.json();
        console.log("DEPARTMENT ID IS ",depId)
        const session: any = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Not Authorised Request", { status: 400 })
        }
        const existing = await Departments.findOne({ AdminId: session?.user?.id, DepartmentName: newName });
        if(existing){
            return Response.json({ existing: true });
        }
        const updatedDep = await Departments.findByIdAndUpdate(depId, { DepartmentName: newName });
        return Response.json(updatedDep);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";