import connectDB from "@/lib/mongo"
import { transporter } from "@/lib/nodemailer";
import { generateOTP } from "@/lib/utils";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest, { params }:{ params: { email: string }}) {
    try {
        const exist = await Users.findOne({ Email: params?.email })
        if( !params?.email || !exist ){
            throw new Error("Email Not Exist Error...")
        }
        const otp = generateOTP();
        exist.VerifyCode = otp;
        await transporter.sendMail({
            from: process.env.NEXT_NODEMAILER_USER,
            to: params?.email,
            subject: "email verification TaskManger",
            text: '...',
            html: `<h1>TaskManager Email Verification</h1>
                    <p>Your One Time Password:</p> <h2>${otp}</h2>`
        })
        await exist.save();
        return Response.json("Email Send Successfully")
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
