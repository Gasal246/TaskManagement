import connectDB from "@/lib/mongo"
import Departments from "@/models/departmentsCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { userid: string }}) {
    try {
        const user = await Users.findById(params.userid, { Addedby: 1 });
        const departments = await Departments.find({ AdminId: user?.Addedby }, { DepartmentName: 1 });
        return Response.json(departments);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
