import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Areas from "@/models/areaCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session: any = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("UnAuthorise Request.", { status: 401 });
        }
        const { areaid } = await req.json();
        const deletedArea = await Areas.findByIdAndDelete(areaid);
        return Response.json(deletedArea);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";