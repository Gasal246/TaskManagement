import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Areas from "@/models/areaCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session: any = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("UnAuthorized Request to Server.", { status: 500 });
        }
        const { name, regionId } = await req.json();
        const existing = await Areas.findOne({ RegionId: regionId, Areaname: name });
        if(existing){
            return Response.json({ existing: true });
        }
        const newArea = new Areas({
            Areaname: name,
            Administrator: session?.user?.id,
            RegionId: regionId
        });
        const savedArea = await newArea.save();
        return Response.json(savedArea);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
