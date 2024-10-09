import connectDB from "@/lib/mongo";
import Departments from "@/models/departmentsCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
    try {
        const user = await Users.findById(params.userid, { Department: 1 });
        const department = await Departments.findById(user?.Department)
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
            }).lean();
        return Response.json(department);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
