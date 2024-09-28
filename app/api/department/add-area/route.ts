import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Not Authorised Request", { status: 400 })
        }
        const { depid, regionid, areaid } = await req.json();
        const existing = await Departments.findOne({ _id: depid, "Regions.RegionId": regionid, "Regions.Areas": areaid })
        if(existing){
            return Response.json({ existing: true })
        }
        const updatedDepartment = await Departments.findOneAndUpdate({ _id: depid, "Regions.RegionId": regionid },{
            $addToSet: { "Regions.$.Areas" : areaid }
        }, { new: true });
        // console.log(updatedDepartment);
        return Response.json(updatedDepartment);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";