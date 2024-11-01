import connectDB from "@/lib/mongo";
import Areas from "@/models/areaCollection";
import Departments from "@/models/departmentsCollection";
import Regions from "@/models/regionCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

type ResultType = {
    department: any | null;
    region: any | null;
    area: any | null;
}

export async function GET(req: NextRequest) {
    try {
        const searchParams: any = req.nextUrl.searchParams;
        const userid: string = searchParams.get('userid');

        const user = await Users.findById(userid, { Role: 1, Department: 1, Region: 1, Area: 1 });
        let result: ResultType = { department: null, region: null, area: null };
        if (user?.Role == 'admin') {
            result['department'] = await Departments.find({ AdminId: user?._id }, { DepartmentName: 1, Staffs: 1 })
                .populate({
                    path: "Staffs",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
                });
            result['region'] = await Regions.find({ Administrator: user?._id })
                .populate({
                    path: "Staffs",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
                });
            result['area'] = await Areas.find({ Administrator: user?._id })
                .populate({
                    path: "Staffs",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
                });
        } else if (user?.Role == 'dep-head') {
            const department = await Departments.findById(user?.Department, { DepartmentName: 1, Regions: 1, Staffs: 1 })
                .populate({
                    path: "Staffs",
                    select: { Name: 1, AvatarUrl: 1, Email: 1, Role: 1 }
                })
            result['department'] = department;
            const regions = department?.Regions?.map(async (reg: any) => {
                const re = await Regions.findById(reg?.RegionId).populate({
                    path: "Staffs",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
                })
                return re
            });
            result['region'] = regions;
            const areas = department?.Regions?.map(async (reg: any) => {
                const array = await Areas.find({ RegionId: reg?.RegionId })
            })
            result['area'] = areas;
        } else if (user?.Role == 'region-head') {
            result['region'] = await Regions.findById(user?.Region)
                .populate({
                    path: "Staffs",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
                });
            result['area'] = await Areas.find({ RegionId: user?.Region })
                .populate({
                    path: "Staffs",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
                })
        } else if (user?.Role == 'area-head') {
            result['area'] = await Areas.findById(user?.Area)
                .populate({
                    path: "Staffs",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
                })
        }
        return Response.json(result);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";