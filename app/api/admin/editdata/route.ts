import connectDB from "@/lib/mongo"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Users from "@/models/userCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Not Authorised to request", { status: 401 })
        }
        const { name, email, adminId } = await req.json();
        // const existing = await Users.findOne({ Email: email });
        // if(existing){
        //     return Response.json({ existing: true });
        // }
        const updatedAdmin = await Users.findByIdAndUpdate(adminId, { Name: name, Email: email });
        return Response.json(updatedAdmin);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic";
