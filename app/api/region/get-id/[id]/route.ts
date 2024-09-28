import connectDB from "@/lib/mongo";
import Regions from "@/models/regionCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { id: string }}){
    try {
        const region = await Regions.findById(params?.id).populate({ path: "RegionHead", select: { Name: 1, Email: 1 }});
        return Response.json(region);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";