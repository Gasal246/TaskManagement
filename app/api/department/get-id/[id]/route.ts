import connectDB from "@/lib/mongo"
import Departments from "@/models/departmentsCollection";
import Regions from "@/models/regionCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { id: string }}) {
    try {
        const awakeRegions = await Regions.find({}).limit(1);
        const department: any = await Departments.findById(params?.id)
            .populate({
                path: "DepartmentHead",
                select: { Name: 1, Email: 1, AvatarUrl: 1 }
            })
            .populate({
                path: "Regions.RegionId",
                select: { RegionName: 1 }
            })
            .populate({
                path: 'Staffs',
                match: { Role: 'dep-staff' },
                select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1, Region: 1, Area: 1, Status: 1 },
                populate: [
                    {
                        path: 'Region',
                        select: { RegionName: 1 },
                    },
                    {
                        path: 'Area',
                        select: { Areaname: 1 },
                    }
                ]
            }).lean()
            if (department && department?.Staffs) {
                department.Staffs = department?.Staffs?.map((staff: any) => ({
                    ...staff,
                    departmentId: department._id
                }));
            }
        const staffCount = await Departments.findById(department?._id, { Staffs: 1 });    
        const outputDep = {...department, staffCount: staffCount?.Staffs?.length}
        // console.log(outputDep)
        return Response.json(outputDep);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
