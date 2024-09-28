import connectDB from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { promises as fs } from 'fs';
import path from "path";
import Users from "@/models/userCollection";

connectDB();

interface Document {
    DocName: string;
    ExpireAt: string;
    RemindAt: string;
    DocUrl: string;
}

interface Body {
    Name: string;
    Email: string;
    Region: string;
    Area: string;
    Skills: string;
    [key: string]: any; // For dynamic document properties
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized Request Error.", { status: 401 });
        }
        const formData = await req.formData();
        const body = Object.fromEntries(formData) as Body;
        // console.log(body);
        const existing = await Users.findOne({ Email: body?.Email, Addedby: session?.user?.id, IsDeleted: false });
        if(existing){
            return Response.json({ existing: true });
        }
        
        const documents: Document[] = [];
        for (let i = 0; ; i++) {
            const name = body[`documents[${i}][name]`];
            if(!name) break;
            documents.push({
                DocName: body[`documents[${i}][name]`],
                ExpireAt: body[`documents[${i}][expireAt]`],
                RemindAt: body[`documents[${i}][remindAt]`],
                DocUrl: body[`documents[${i}][file]`]
            });
        }

        const newUser = new Users({
            Email: body?.Email,
            Name: body?.Name,
            Skills: body?.Skills?.split(','),
            Region: body?.Region,
            Area: body?.Area,
            Status: 'unverified',
            InitialEntry: true,
            Addedby: session?.user?.id,
            Documents: documents,
            Role: 'staff'
        });
        const savedUser = await newUser.save();
        return Response.json(savedUser);
    } catch (error) {
        console.error("Error:", error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
