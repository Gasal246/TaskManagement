import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Admindatas from "@/models/adminDataCollection";
import Users from "@/models/userCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if(!session) return new NextResponse("Server Req Un-Authorized", { status: 502 })
        const { adminid, status } = await req.json();
        const adminData = await Admindatas.findById(adminid);
        const updatedAdminUser = await Users.findByIdAndUpdate(adminData?.AdminId, { Status: status });
        return Response.json(adminData)
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
