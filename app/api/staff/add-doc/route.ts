import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

connectDB();

interface Body {
    staffid: string;
    DocName: string;
    ExpireAt: string;
    RemindAt: string;
    // Document: File;
    Document: string;
    [key: string]: any; // For dynamic document properties
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const formData = await req.formData();
        const body = Object.fromEntries(formData) as Body;
        const staff = await Users.findById(body?.staffid, { Documents: 1, Email: 1 });
        if(staff?.Documents?.some((doc: any) => doc?.DocName === body?.DocName )){
            return Response.json({ existing: true });
        }
        const newDoc = {
            DocName: body?.DocName,
            ExpireAt: body?.ExpireAt || null,
            RemindAt: body?.RemindAt || null,
            DocUrl: body?.Document,
        }
        const updatedStaff = await Users.findByIdAndUpdate(body?.staffid, { $push: { Documents: newDoc }}, { new: true });
        return Response.json(updatedStaff);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
