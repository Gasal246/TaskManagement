import connectDB from "@/lib/mongo";
import Regions from "@/models/regionCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { adminid: string }}) {
    try {
        const regions = await Regions.find({ Administrator: params?.adminid });
        return Response.json(regions);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
