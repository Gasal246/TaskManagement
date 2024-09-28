import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";
import { sendNotification } from "../../helpers/notification-helper";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const { depId, staffid } = await req.json();
        const updatedDepartment = await Departments.findByIdAndUpdate(depId, { $pull: { Staffs: staffid } }, { new: true });
        const updatedStaff = await Users.findByIdAndUpdate(staffid, { Role: 'staff' });
        await sendNotification("Role Updated", `You are removed from the department staff list and your role has been changed to staff.`, session?.user?.id, staffid);
        return Response.json(updatedDepartment);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
