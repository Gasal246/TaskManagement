import connectDB from "@/lib/mongo"
import Areas from "@/models/areaCollection";
import Departments from "@/models/departmentsCollection";
import Regions from "@/models/regionCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { id: string, region: string }}) {
    try {
        const RegionsRefresh = await Regions.find().limit(1);
        const AreaRefresh = await Areas.find().limit(1);
        const departmentRegion = await Departments.findOne({ _id: params.id, Regions: { $elemMatch: { RegionId: params.region }}})
            .populate({
                path: "Regions.RegionId",
                select: { RegionName: 1, RegionHead: 1 },
                populate: {
                    path: "RegionHead",
                    select: { AvatarUrl: 1, Name: 1, Email: 1 }
                }
            })
            .populate({
                path: "Regions.Areas",
                select: { Areaname: 1 }
            });
        const region = departmentRegion?.Regions?.find((reg: any) => reg.RegionId && reg.RegionId._id.toString() === params?.region);
        console.log(region)
        return Response.json(region)
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
