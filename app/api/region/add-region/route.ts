import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { stat } from "fs";
import Regions from "@/models/regionCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session: any = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorised Error.", { status: 401 });
        }
        const { name } = await req.json();
        const existing = await Regions.findOne({ Administrator: session?.user?.id, RegionName: name });
        if(existing){
            return Response.json({ existing: true });
        }
        const newRegion = new Regions({
            RegionName: name,
            Administrator: session?.user?.id
        });
        const savedRegion = await newRegion.save();
        return Response.json(savedRegion);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";