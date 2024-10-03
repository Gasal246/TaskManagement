import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";
import Areas from "@/models/areaCollection";
import Users from "@/models/userCollection";

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
        const area = await Areas.findById(areaid, { AreaHead: 1 })
            .populate({
                path: "AreaHead",
                select: { Department: 1 }
            });
        if(area?.AreaHead?.Department && area?.AreaHead?.Department !== depid){
            return Response.json("Department of selected Area Head is Not Matching...")
        }
        if(!area?.AreaHead?.Department){
            await Users.findByIdAndUpdate(area?.AreaHead?._id, { Department: depid }, { new: true });
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