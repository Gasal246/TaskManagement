import connectDB from "@/lib/mongo"
import { generateOTP } from "@/lib/utils";
import Users from "@/models/userCollection";
import { hash } from "bcrypt-ts";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest){
    try {
        const { email, password, pin } = await req.json();
        const hashedPassword = await hash(password, 10);
        const user = await Users.findOne({ Email: email });
        if(user?.VerifyCode !== pin){
            return Response.json({pinError: "pin not fount"})
        }
        const newpin = generateOTP()
        const updatedUser = await Users.findByIdAndUpdate(user?._id, { Password: hashedPassword, InitialEntry: false, Status: 'active', VerifyCode: newpin });
        return Response.json(updatedUser)
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
