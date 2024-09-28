import connectDB from "@/lib/mongo"
import Admindatas from "@/models/adminDataCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { adminid: string }}){
    try {
        const adminData = await Admindatas.findOne({ AdminId: params?.adminid })
            .populate({
                path: "Departments",
                populate: {
                    path: "DepartmentHead",
                    select: { Password: 0 }
                }
            });
        const adminUser = await Users.findById(params?.adminid, { Password: 0 });
        return Response.json({ adminData, adminUser })
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic"