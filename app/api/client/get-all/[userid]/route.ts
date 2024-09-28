import connectDB from "@/lib/mongo";
import Clients from "@/models/clientCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
    try {
        const user = await Users.findById(params?.userid, { Role: 1, Addedby: 1 });
        let clients = []
        if (user?.Role == 'admin') {
            clients = await Clients.find({ AdminId: params.userid })
                .populate({
                    path: "AddedBy",
                    select: { Name: 1, Email: 1, AvatarUrl: 1 }
                })
                .populate({
                    path: "Region",
                    select: { RegionName: 1 }
                })
                .populate({
                    path: "Area",
                    select: { Areaname: 1 }
                })
        } else {
            clients = await Clients.find({ AddedBy: params.userid })
                .populate({
                    path: "Region",
                    select: { RegionName: 1 }
                })
                .populate({
                    path: "Area",
                    select: { Areaname: 1 }
                });
        }
        return Response.json(clients);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";