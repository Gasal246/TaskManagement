import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { adminid: string }}) {
    try {
        const admin = await Users.findById(params.adminid, { Role: 1 });
        if(!admin || admin?.Role != 'admin'){
            return new NextResponse("Provided AdminId is not a match to our current admin data", { status: 402 });
        }
        const { searchParams } = new URL(req.url);
        const roles = searchParams.get('roles')?.split(',') || ['staff'] as userTypes[];
        const users = await Users.find({ Addedby: params.adminid, Role: { $in: roles } });
        return Response.json(users);
    } catch (error) {
        console.log(error)
        return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
    }
}

export const dynamic = "force-dynamic";

