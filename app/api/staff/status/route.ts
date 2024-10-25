import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { sendTrigger } from "../../helpers/notification-helper";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const user = await Users.findById(session?.user?.id, { Role: 1 });
        const { staffid, status }: { staffid: string, status: StaffStatus } = await req.json();
        if (status === 'blocked') {
            console.log("Blocking user and sending notification.");
            await sendTrigger(`channel-${staffid}`, 'block-user', `You Have Been Blocked By ${user?.Role}`);
        }
        const updatedUser = await Users.findByIdAndUpdate(staffid, { Status: status });
        return Response.json(updatedUser);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
