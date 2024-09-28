import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import fs from 'fs';
import path from 'path';

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const { staffid } = await req.json();
        const staff = await Users.findById(staffid);
        if(staff?.Department){
            const deletedStaff = await Users.findByIdAndUpdate(staffid, { IsDeleted: true });
            return Response.json(deletedStaff);
        }else{
            const deletedStaff = await Users.findByIdAndDelete(staffid);
            return Response.json(deletedStaff);
        }
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
