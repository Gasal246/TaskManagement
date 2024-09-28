import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const { staffid, Name, Email, Region, Area } = await req.json();

        // If the same email is not existing for any other users.
        const existing = await Users.findOne({ Email });
        if(existing && existing?._id?.toString() !== staffid){
            return Response.json({ existing: true });
        }
        const updatedStaff = await Users.findByIdAndUpdate(staffid, { Name, Email, Region, Area });
        console.log(updatedStaff);
        return Response.json(updatedStaff);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
