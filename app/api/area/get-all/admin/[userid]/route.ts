import connectDB from "@/lib/mongo";
import Areas from "@/models/areaCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET ( req: NextRequest, { params }: { params: { userid: string }} ) {
    try {
        const user = await Users.findById(params.userid, { Role: 1 });
        if(user?.Role != 'admin'){
            return new NextResponse("Not An Admin Error", { status: 404 });
        }
        const areas = await Areas.find({ Administrator: params.userid });
        return Response.json(areas);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";