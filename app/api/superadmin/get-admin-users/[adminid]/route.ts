import connectDB from "@/lib/mongo";
import Areas from "@/models/areaCollection";
import Regions from "@/models/regionCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { adminid: string } }){
    try {
        const admin = await Users.findById(params.adminid, { Role: 1 });
        if(admin?.Role !== 'admin'){
            return new NextResponse("Error on (getting all users) Provided id is not an admin id ", { status: 402 });
        }
        const awakeRegions = await Regions.find({}).limit(1);
        const awakeAreas = await Areas.find({}).limit(1);
        const allUsers = await Users.find({ Addedby: params.adminid }, { Name: 1, Email: 1, AvatarUrl: 1, Role: 1, Region: 1, Area: 1 })
            .populate({
                path: "Region",
                select: { RegionName: 1 }
            })
            .populate({
                path: "Area",
                select: { Areaname: 1 }
            })
        return Response.json(allUsers);
    } catch (error) {
        console.log(error);
        return new NextResponse(`Internal Server Error: ${error}`, { status: 500 })
    }
}

export const dynamic = "force-dynamic";
