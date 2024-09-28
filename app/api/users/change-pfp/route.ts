import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Users from "@/models/userCollection";

connectDB();

interface Body {
    userid: string;
    docUrl: string;
    [key: string]: any;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Not Authorized Request", { status: 401 });
        }
        const formData = await req.formData();
        const body = Object.fromEntries(formData) as Body;
        const updatedUser = await Users.findByIdAndUpdate(body?.userid, { AvatarUrl: body?.docUrl }, { new: true } );
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
