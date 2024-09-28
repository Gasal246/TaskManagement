import connectDB from "@/lib/mongo"
import Notifications from "@/models/notificationCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { userid: string } }){
    try {
        const notifications = await Notifications.find({ ReceiverId: params?.userid })
            .populate({
                path: "SenderId",
                select: { Name: 1, Email:1, AvatarUrl: 1, Role: 1 }
            }).sort({ createdAt: -1 });
        return Response.json(notifications);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 401 });
    }
}

export const dynamic = "force-dynamic"