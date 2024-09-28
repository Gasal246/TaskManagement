import connectDB from "@/lib/mongo";
import Departments from "@/models/departmentsCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const depid = searchParams.get('depid');
        const regid = searchParams.get('regid');
        const areaid = searchParams.get('areaid');
        // console.log(depid, regid, areaid);
        const stafflist: any = await Departments.findById(depid, { Staffs: 1 })
            .populate({
                path: 'Staffs',
                match: { Role: 'staff', Region: regid, Area: areaid },
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
        return Response.json(stafflist);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 })
    }
}

export const dynamic = "force-dynamic";