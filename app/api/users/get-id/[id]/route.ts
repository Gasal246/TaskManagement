import connectDB from "@/lib/mongo";
import Areas from "@/models/areaCollection";
import Departments from "@/models/departmentsCollection";
import Regions from "@/models/regionCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { id: string }}){
    try {
        const triggerRegions = await Regions.find({}).limit(1);
        const triggerArea = await Areas.find({}).limit(1);
        const triggerDep = await Departments.find({}).limit(1);
        const user = await Users.findById(params?.id, { Password: 0 })
            .populate({
                path: "Region",
                select: { RegionName: 1 }
            })
            .populate({
                path: "Area",
                select: { Areaname: 1 }
            })
            .populate({
                path: "Department"
            });
        return Response.json(user);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
