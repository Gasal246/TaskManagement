import connectDB from "@/lib/mongo";
import Notifications from "@/models/notificationCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { nid: string }}) {
    try {
        const updatedNotification = await Notifications.findByIdAndUpdate(params?.nid, { IsOpened: true });
        return Response.json(updatedNotification);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";