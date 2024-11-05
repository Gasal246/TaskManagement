import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";
import { sendNotification } from "../../helpers/notification-helper";
import mongoose from "mongoose";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const { depId, staffid }: { depId: string, staffid: string } = await req.json();
        const department = await Departments?.findById(depId);
        if(department?.MaximumStaffs == department?.Staffs?.length){
            return Response.json({ overflow: true });
        }
        const existing = await Departments.findOne({ _id: depId, Staffs: { $in: staffid }});
        if(existing){
            return Response.json({ existing: true });
        }
        await Users.findByIdAndUpdate(staffid, { Role: 'dep-staff', Department: depId }, { new: true });
        await sendNotification("Role Updated to Deparment Staff", `Your current role has been updated to department staff.`, session?.user?.id, staffid, 'role-change');
        const staffId = new mongoose.Types.ObjectId(staffid);
        const updatedDep = await Departments.findByIdAndUpdate(depId, { $push: { Staffs: staffId } }, { new: true });
        return Response.json(updatedDep);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
