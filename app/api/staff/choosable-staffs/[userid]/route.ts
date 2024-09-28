import connectDB from "@/lib/mongo";
import Departments from "@/models/departmentsCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
    try {
        const user = await Users.findById(params?.userid);
        let stafflist: any;
        if (user?.Role === 'staff' || user?.Role === 'area-head') {
            stafflist = await Departments.findById(user?.Department, { Staffs: 1 })
                .populate({
                    path: 'Staffs',
                    match: { Role: 'staff', Region: user?.Region, Area: user?.Area },
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
            if (stafflist && stafflist?.Staffs) {
                stafflist.Staffs = stafflist?.Staffs?.map((staff: any) => ({
                    ...staff,
                    departmentId: stafflist._id
                }));
            }
        } else if (user?.Role === 'region-head' || user?.Role === 'reg-staff') {
            stafflist = await Departments.findById(user?.Department, { Staffs: 1 })
                .populate({
                    path: 'Staffs',
                    match: { Role: 'reg-staff', Region: user?.Region },
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
            if (stafflist && stafflist?.Staffs) {
                stafflist.Staffs = stafflist?.Staffs?.map((staff: any) => ({
                    ...staff,
                    departmentId: stafflist._id
                }));
            }
        } else if (user?.Role === 'dep-head' || user?.Role === 'dep-staff') {
            stafflist = await Departments.find({ _id: user?.Department }, { Staffs: 1 })
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