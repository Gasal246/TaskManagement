import connectDB from "@/lib/mongo"
import Users from "@/models/userCollection";
import Password from "antd/es/input/Password";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { email: string }}){
    try {
        const email = params?.email;
        const user = await Users.findOne({ Email: email }, { Password: 0 });
        return Response.json(user);
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"

