import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Regions from "@/models/regionCollection";
import Areas from "@/models/areaCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("UnAuthorised Request.", { status: 401 });
        }
        const { regionId } = await req.json();
        const deletedRegion = await Regions.findByIdAndDelete(regionId);
        await Areas.deleteMany({ RegionId: deletedRegion?._id });
        return Response.json(deletedRegion);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";