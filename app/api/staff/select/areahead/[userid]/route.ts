import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
    try {
        const user = await Users.findById(params.userid, { Role: 1, Addedby: 1 });
        let adminid = user?.Addedby;
        if(user?.Role == 'admin'){
            adminid = user?._id
        }
        const staffs = await Users.find({ Addedby: adminid, Role: { $in: ['staff', 'reg-staff', 'dep-staff'] } }, { Name: 1, Email: 1, AvatarUrl: 1, Role: 1, Skills: 1 });
        return Response.json(staffs);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
