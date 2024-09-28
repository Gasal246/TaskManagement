import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { adminid: string }}) {
    try {
        const staffs = await Users.find({ Addedby: params.adminid })
            .populate({
                path: "Region",
                select: { RegionName: 1, RegionHead: 1 }
            })
            .populate({
                path: "Area",
                select: { Areaname: 1, AreaHead: 1 }
            })
        return Response.json(staffs);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
