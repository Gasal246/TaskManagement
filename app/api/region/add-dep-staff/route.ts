import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";
import { sendNotification } from "../../helpers/notification-helper";
import mongoose from "mongoose";
import Regions from "@/models/regionCollection";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const { depId, regId, staffId }: { depId: string, regId:string, staffId: string } = await req.json();
        const department = await Departments?.findById(depId);
        if(department?.MaximumStaffs == department?.Staffs?.length){
            return Response.json({ overflow: true });
        }
        const existing = await Departments.findOne({ _id: depId, Staffs: { $in: staffId }});
        if(existing){
            return Response.json({ existing: true });
        }
        const region = await Regions.findById(regId, { RegionName: 1 });
        const updatedStaff = await Users.findByIdAndUpdate(staffId, { Role: 'reg-staff', Region: regId, Department: depId }, { new: true });
        await sendNotification("Selected as Regional Staff", `Your current role has been updated to regional staff of ${region?.RegionName}.`, session?.user?.id, staffId, 'role-change');
        const staffid = new mongoose.Types.ObjectId(staffId);
        const updatedDep = await Departments.findByIdAndUpdate(depId, { $push: { Staffs: staffId } }, { new: true });
        return Response.json(updatedDep);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
