import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Not Authorised Request", { status: 400 })
        }
        const { departmentid } = await req.json();
        const department = await Departments.findById(departmentid);
        if(!department?.IsDemo && department?.Staffs?.length > 0){
            const updatedDep = await Departments.findByIdAndUpdate(departmentid, { IsDeleted: true });
            return Response.json(updatedDep);
        }
        const deletedDep = await Departments.findByIdAndDelete(departmentid);
        return Response.json(deletedDep);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";