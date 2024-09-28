import connectDB from "@/lib/mongo";
import Skills from "@/models/skillsCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { adminid: string }}){
    try {
        const allSkills = await Skills.findOne({ AdminId: params.adminid });
        return Response.json(allSkills);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}