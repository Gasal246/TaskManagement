import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Departments from "@/models/departmentsCollection";
import { ObjectId } from "mongodb";
import Regions from "@/models/regionCollection";
import Users from "@/models/userCollection";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Not Authorised Request", { status: 400 })
        }
        const { depid, regionid } = await req.json();
        const newRegion = { RegionId: new ObjectId(`${regionid}`), Areas: [] };
        const region = await Regions.findById(regionid, { RegionHead: 1 })
            .populate({
                path: "RegionHead",
                select: { Department: 1 }
            });
            if(region?.RegionHead?.Department && region?.RegionHead?.Department !== depid){
                return Response.json("Department of selected REgion Head is Not Matching...")
            }
            if(!region?.RegionHead?.Department){
                await Users.findByIdAndUpdate(region?.RegionHead?._id, { Department: depid }, { new: true });
            }
        const updatedDep = await Departments.findByIdAndUpdate(depid, { $push: { Regions: newRegion } }, { new: true });
        return Response.json(updatedDep);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
