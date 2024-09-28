import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userid = searchParams.get('id');
        const user = await Users.findById(userid, { Role: 1 });
        if (!user) {
            throw new Error(`User not found for id: ${userid}`);
        }
        return Response.json({ Role: user?.Role });
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error: " + error, { status: 500 });
    }
}

export const dynamic = "force-dynamic"