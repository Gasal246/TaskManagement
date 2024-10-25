import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Regions from "@/models/regionCollection";
import Users from "@/models/userCollection";
import { sendNotification } from "../../helpers/notification-helper";

connectDB();

export async function POST(req: NextRequest){
    try {
        const session: any = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorised Error.", { status: 401 });
        }
        const { regionid, staffid } = await req.json();
        const existing = await Regions.findOne({ _id: regionid });
        if(existing?.RegionHead == staffid){
            return Response.json({ existing: true });
        }
        const theStaff = await Users.findById(staffid);
        const updatedStaff = await Users.findByIdAndUpdate(existing?.RegionHead, { Role: 'staff' }, { new: true });
        const upadatedUser = await Users.findByIdAndUpdate(staffid, { Role: 'region-head', Region: regionid });
        const updatedRegion = await Regions.findByIdAndUpdate(regionid, { RegionHead: staffid });
        const notification = await sendNotification("Role Update For You", `Your Current Role as "${theStaff?.Role}" have been changed to "Regional Head". This will make authenticational updates on your personolized features.`, session?.user?.id, upadatedUser?._id);
        const existNotif = await sendNotification("Your Position Changed", `Your Current Postion as "Region Head" of ${existing?.RegionName} have been changed. you may not have some privillages from now on.`, session?.user?.id, updatedStaff?._id);
        return Response.json(updatedRegion);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";

