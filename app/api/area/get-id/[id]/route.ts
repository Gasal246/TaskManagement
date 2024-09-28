import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongo";
import Areas from "@/models/areaCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { id: string }}){
    try {
        const area = await Areas.findById(params.id).populate({
            path: "AreaHead",
            select: { Password: 0, Documents: 0, Skills: 0 }
        })
        return Response.json(area);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";