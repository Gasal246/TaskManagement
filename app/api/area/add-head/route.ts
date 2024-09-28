import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Areas from "@/models/areaCollection";
import Users from "@/models/userCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session: any = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorised Error.", { status: 401 });
        }
        const { areaid, staffid } = await req.json();
        const existing = await Areas.findOne({ _id: areaid, AreaHead: staffid });
        if(existing){
            return Response.json({ existing: true });
        }
        const updatedUser = await Users.findByIdAndUpdate(staffid, { Role: 'area-head' });
        const updatedRegion = await Areas.findByIdAndUpdate(areaid, { AreaHead: staffid });
        return Response.json(updatedRegion);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";