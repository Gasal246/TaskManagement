import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";
import Users from "@/models/userCollection";
import { sendTrigger } from "../../helpers/notification-helper";

connectDB();

export async function POST(req: NextRequest){
    try {
        const { depId, newName } = await req.json();
        console.log("DEPARTMENT ID IS ",depId)
        const session: any = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Not Authorised Request", { status: 400 })
        }
        const existing = await Departments.findOne({ AdminId: session?.user?.id, DepartmentName: newName });
        if(existing){
            return Response.json({ existing: true });
        }
        const editedBy = await Users.findById(session?.user?.id, { Role: 1 });
        const editingDep = await Departments.findById(depId, { DepartmentHead: 1 });
        if(editingDep?.DepartmentHead){
            await sendTrigger(`channel-${editingDep?.DepartmentHead}`, 'dep-name-changed')
        }
        const updatedDep = await Departments.findByIdAndUpdate(depId, { DepartmentName: newName });
        return Response.json(updatedDep);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";