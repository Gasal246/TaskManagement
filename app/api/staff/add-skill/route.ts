import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const { staffId, skill } = await req.json();
        const staffMember = await Users.findById(staffId);
        if (staffMember.Skills.includes(skill)) {
            return Response.json({ exists: true });
        }
        const updatedStaff = await Users.findByIdAndUpdate(staffId, { $push: { Skills: skill } }, { new: true });
        // console.log(updatedStaff)
        return Response.json(updatedStaff);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
