import connectDB from "@/lib/mongo"
import Admindatas from "@/models/adminDataCollection";
import Departments from "@/models/departmentsCollection";
import Projects from "@/models/projectCollection";
import Tasks from "@/models/taskCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { id: string }}){
    try {
        await Departments.find().limit(1);
        const adminData = await Admindatas.findById(params?.id)
            .populate({
                path: "AdminId",
                select: { Password: 0, Skills: 0, Documents: 0 }
            })
            .populate({
                path: "Departments",
                populate: {
                    path: "DepartmentHead",
                    select: { Name: 1, Email: 1, AvatarUrl: 1 }
                }
            });
        const projectCount = await Projects.find({ AdminId: adminData?.AdminId?._id }).countDocuments();
        const tasksCount = await Tasks.find({ AdminId: adminData?.AdminId?._id }).countDocuments();
        const adminUsers = await Users.find({ Addedby: adminData?.AdminId?._id }, { Name: 1, AvatarUrl: 1, Email: 1, Role: 1, Region: 1, Area: 1 })
            .populate({
                path: "Region",
                select: { RegionName: 1 }
            })
            .populate({
                path: "Area",
                select: { Areaname: 1 }
            })
        return Response.json({ ...adminData?._doc, projectCount, tasksCount, adminUsers })
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic"
