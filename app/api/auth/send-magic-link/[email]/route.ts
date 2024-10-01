import connectDB from "@/lib/mongo"
import { transporter } from "@/lib/nodemailer";
import { generateOTP } from "@/lib/utils";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";
import { URL } from "url";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
    try {
        const exist = await Users.findOne({ Email: params?.email })
        if( !params?.email || !exist ){
            throw new Error("Email Not Exist Error...")
        }
        const encodedEmail = encodeURIComponent(params?.email);
        await transporter.sendMail({
            from: process.env.NEXT_NODEMAILER_USER,
            to: params?.email,
            subject: "magic link for Reset Password",
            text: '...',
            html: `<h1>Forget Password ?</h1>
                    <p>Follow this link to get into <strong>Reset Password Page</strong>:</p> 
                    <a href="${process.env.NEXTAUTH_URL}/verification/${encodedEmail}/reset-password/${exist?.VerifyCode}">
                        <h2>${process.env.NEXTAUTH_URL}/verification/${params?.email}/reset-password/${exist?.VerifyCode}</h2>
                    </a>`
        })
        exist.InitialEntry = true;
        await exist.save();
        return Response.json("Email Send Successfully")
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";