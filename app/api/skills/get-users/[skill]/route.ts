import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { skill: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const companyid = searchParams.get('companyid');
        const users = await Users.find({ Addedby: companyid, Skills: params.skill, }, { Name: 1, Email: 1, AvatarUrl: 1, Role: 1, Skills: 1 });
        return Response.json(users)
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";

