import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Users, { IUsers } from "@/models/userCollection";
import { compare, hash } from "bcrypt-ts";
import { transporter } from "@/lib/nodemailer";
import { formatDate } from "@/lib/utils";
import { sendNotification } from "../../helpers/notification-helper";
import mongoose from "mongoose";

connectDB();

interface Body {
    currentPass: string;
    newPass: string;
    [key: string]: any;
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) { return new NextResponse("Un Authorized Access.", { status: 402 }); }
        const formData = await req.formData();
        const body = Object.fromEntries(formData) as Body;
        let response;
        await Users.findById(session?.user?.id).then(async (data: Partial<IUsers>) => {
            const passMatch = await compare(body?.currentPass, data.Password!);
            if (passMatch) {
                const hashedPass = await hash(body?.newPass, 10);
                const updatedUser = await Users.findByIdAndUpdate(data?._id, { Password: hashedPass }, { new: true });
                await transporter.sendMail({
                    from: process.env.NEXT_NODEMAILER_USER,
                    to: data?.Email!,
                    subject: "TaskManger Password Changed.",
                    text: '...',
                    html: `<h1>Task Manager</h1>
                            <h4>This is to inform that Your password as a ${data?.Role} TaskManager has been changed on: <u>${formatDate(new Date().toISOString())}</u></h4>
                            <br>
                            <p>If it is not you please report to your admin.</p>
                            <br>
                            <p>Thank you!!</p>`
                })
                await sendNotification("Your Password Has been Changed", `Your password as a ${data?.Role} TaskManager has been changed.`, data._id!.toString(), data._id!.toString(), 'password-changed');
                response = Response.json(updatedUser);
            } else {
                console.log("Current Password is Invalid.")
                response = Response.json({ mismatch: true })
            }
        }).catch((err: any) => new NextResponse("Cannot find any authorized users", { status: 402 }));
        return response;
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
