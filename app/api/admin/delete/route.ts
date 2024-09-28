import connectDB from "@/lib/mongo"
import Admindatas from "@/models/adminDataCollection";
import Areas from "@/models/areaCollection";
import Departments from "@/models/departmentsCollection";
import Regions from "@/models/regionCollection";
import Users from "@/models/userCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { promises as fs } from 'fs';
import path from "path";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return new NextResponse("Un-Authorised Server Request.", { status: 404 });
        const { adminid } = await req.json();
        const adminData = await Admindatas.findById(adminid);
        await adminData?.Documents?.map(async (doc: any) => {
            const filePath = path.join(process.cwd(), 'public', doc?.DocUrl);
            await fs.unlink(filePath).catch((err) => {
                console.log(err)
            });
        })
        const deletedAdmin = await Admindatas.findByIdAndDelete(adminid);
        if (!deletedAdmin) {
            return new NextResponse("Admin not found.", { status: 404 });
        }
        const deletedUser = await Users.findByIdAndDelete(deletedAdmin?.AdminId);
        if (!deletedUser) {
            return new NextResponse("User not found.", { status: 404 });
        }
        await Departments.deleteMany({ AdminId: deletedUser?._id });
        await Regions.deleteMany({ Administrator: deletedUser?._id });
        await Areas.deleteMany({ Administrator: deletedUser?._id });
        return Response.json(deletedAdmin);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic"
