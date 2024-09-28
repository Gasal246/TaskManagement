import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Skills from "@/models/skillsCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session: any = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("UnAuthorised Route", { status: 401 });
        }
        const { adminId, skill } = await req.json();
        const existing = await Skills.findOne({ AdminId: adminId });
        if(existing){
            const updatedSkill = await Skills.findOneAndUpdate({ AdminId: adminId }, { $push: { Skills: skill }}, { new: true });
            return Response.json(updatedSkill);
        }
        const newSkill = new Skills({
            AdminId: adminId,
            Skills: [ skill ]
        });
        const savedSkill = await newSkill.save();
        return Response.json(savedSkill);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";