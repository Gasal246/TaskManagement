import connectDB from "@/lib/mongo"
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server"

connectDB()

export async function POST(req: NextRequest){
    try {
        const { email, otp } = await req.json();
        const user = await Users.findOne({ Email: email });
        if(!user){
            throw new Error("User Not Found.. check session > user > id")
        }
        if(!user?.VerifyCode){
            throw new Error("Verification Code Not Found ")
        }
        if(user?.VerifyCode === otp){
            return Response.json("OTP Verified Successfully.")
        }else{
            throw new Error("OTP Verification Failed.")
        }
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
