import connectDB from "@/lib/mongo"
import Users from "@/models/userCollection";
import { hash } from "bcrypt-ts";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest){
    try {
        const { email, password } = await req.json();
        const hashedPassword = await hash(password, 10);
        const updatedUser = await Users.findOneAndUpdate({ Email: email }, { Password: hashedPassword, InitialEntry: false });
        return Response.json(updatedUser)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
