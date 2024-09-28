import connectDB from "@/lib/mongo";
import Areas from "@/models/areaCollection";
import Regions from "@/models/regionCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { adminid: string } }) {
    try {
        const regionShaking = await Regions.find().limit(1);
        const areaShaking = await Areas.find().limit(1);
        const staffs = await Users.find({ Addedby: params?.adminid, IsDeleted: false }, { Password: 0, Documents: 0, Skills: 0 })
            .populate({
                path: "Region",
                select: { RegionName: 1 }
            })
            .populate({
                path: "Area",
                select: { Areaname: 1 }
            })
            .sort({ createdAt: -1 })
        // console.log(staffs)
        return Response.json(staffs);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
