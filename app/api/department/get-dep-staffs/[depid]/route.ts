import connectDB from "@/lib/mongo"
import Areas from "@/models/areaCollection";
import Departments from "@/models/departmentsCollection";
import Regions from "@/models/regionCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { depid: string } }) {
    try {
        const dep = await Departments.findById(params.depid);
        if (!dep || dep?.IsDeleted) {
            return new NextResponse("Error (getting department staffs) Invalid Department Id", { status: 402 });
        }
        await Regions.find({}).limit(1);
        await Areas.find({}).limit(1);
        const depStaffs = await Departments.find({ _id: params?.depid }, { Staffs: 1 })
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
        return Response.json(depStaffs);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic"