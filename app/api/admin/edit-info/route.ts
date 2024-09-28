import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Admindatas from "@/models/adminDataCollection";
import Users from "@/models/userCollection";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Server Req Un-Authorized", { status: 502 })
        const { userid, email, name } = await req.json();
        const existing = await Users.findOne({ Email: email }, { Name: 1 });
        if (existing && existing?._id != userid) {
            return Response.json({ existing: true })
        }
        const updatedUser = await Users?.findByIdAndUpdate(userid, { Email: email, Name: name });
        return Response.json(updatedUser);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
