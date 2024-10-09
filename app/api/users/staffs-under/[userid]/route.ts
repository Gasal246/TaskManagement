import connectDB from "@/lib/mongo";
import Areas from "@/models/areaCollection";
import Departments from "@/models/departmentsCollection";
import Regions from "@/models/regionCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest, { params }: { params: { userid: string } }) {
    try {
        const user = await Users.findById(params.userid, { Role: 1, Area: 1 });
        let staffs = [];
        switch (user?.Role) {
            case "area-head": {
                const area = await Areas.findById(user?.Area, { Staffs: 1 })
                    .populate({
                        path: "Staffs",
                        select: { AvatarUrl: 1, Email: 1, Name: 1, Area: 1, Region: 1, Role: 1, Status: 1 },
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
                    })
                staffs = area?.Staffs;
            } break;
            case "region-head": {
                const region = await Regions.findById(user?.Region, { Staffs: 1 })
                    .populate({
                        path: "Staffs",
                        select: { AvatarUrl: 1, Email: 1, Name: 1, Area: 1, Region: 1, Role: 1, Status: 1 },
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
                    })
                staffs = region?.Staffs;
            } break;
            case "dep-head": {
                const department = await Departments.findById(user?.Department)
                    .populate({
                        path: "Staffs",
                        select: { AvatarUrl: 1, Email: 1, Name: 1, Area: 1, Region: 1, Role: 1, Status: 1 },
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
                staffs = department?.Staffs
            } break;
            default: {
                return new NextResponse("You have'nt provided a valuable userid", { status: 400 });
            }
        }
        return Response.json(staffs);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
