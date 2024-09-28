import connectDB from "@/lib/mongo"
import Departments from "@/models/departmentsCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { adminid: string }}) {
    try {
        const departments = await Departments.find({ AdminId: params.adminid });
        return Response.json(departments);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
