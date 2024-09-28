import connectDB from "@/lib/mongo";
import Areas from "@/models/areaCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { regionid: string } }) {
    try {
        const areas = await Areas.find({ RegionId: params?.regionid });
        return Response.json(areas);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic";
