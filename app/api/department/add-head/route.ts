import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";
import Users from "@/models/userCollection";
import { sendNotification } from "../../helpers/notification-helper";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session: any = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Not Authorised Request", { status: 400 })
        }
        const { depid, staffid } = await req.json();
        const userBefore = await Users.findById(staffid, { Role: 1 });
        await Users.findByIdAndUpdate(staffid, { Role: 'dep-head', Department: depid });
        const updatedDep = await Departments.findByIdAndUpdate(depid, { DepartmentHead: staffid });
        await sendNotification("Role Changed", `Your Role as ${userBefore?.Role} has been changed to Department Head`, session?.user?.id, staffid, 'role-change');
        return Response.json(updatedDep);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";