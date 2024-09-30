import connectDB from "@/lib/mongo";
import Areas from "@/models/areaCollection";
import Departments from "@/models/departmentsCollection";
import Regions from "@/models/regionCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
    try {
        const user = await Users.findById(params?.userid);
        let stafflist: any;
        if (user?.Role === 'area-head') {
            stafflist = await Areas.findById(user?.Area, { Staffs: 1 })
                .populate({
                    path: "Staffs",
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
                }).lean();
        } else if (user?.Role === 'region-head') {
            stafflist = await Regions.findById(user?.Region, { Staffs: 1 })
                .populate({
                    path: "Staffs",
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
                }).lean();
        } else if (user?.Role === 'dep-head') {
            stafflist = await Departments.findById(user?.Department, { Staffs: 1 })
                .populate({
                    path: 'Staffs',
                    match: { Role: 'dep-staff' },
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1, Region: 1, Area: 1 },
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
                });
        }
        // console.log(stafflist);
        return Response.json(stafflist);
    } catch (error) {
        console.log(error);
        return new NextResponse('Internal Server Error.', { status: 500 })
    }
}

export const dynamic = "force-dynamic";