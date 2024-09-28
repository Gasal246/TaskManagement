import connectDB from "@/lib/mongo";
import Areas from "@/models/areaCollection";
import Departments from "@/models/departmentsCollection";
import Projects from "@/models/projectCollection";
import Regions from "@/models/regionCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { projectid: string }}){
    try {
        await Departments.find({}).limit(1);
        await Regions.find({}).limit(1);
        await Areas.find({}).limit(1);
        const project = await Projects.findById(params.projectid, { Flow: 0, Comments: 0 })
            .populate({
                path: "Creator",
                select: { Name: 1, Email: 1, AvatarUrl: 1 }
            })
            .populate({
                path: "Documents.AccessTo",
                select: { Name: 1, Email: 1, AvatarUrl: 1 }
            })
            .populate({
                path: "AccessTo",
                select: { Name: 1, Email: 1, AvatarUrl: 1, Department: 1 },
                populate: {
                    path: "Department",
                    select: { DepartmentName: 1 }
                }
            })
            .populate({
                path: "OpenedBy",
                select: { Name: 1, Email: 1, AvatarUrl: 1, Department: 1 },
                populate: {
                    path: "Department",
                    select: { DepartmentName: 1 }
                }
            })
            .populate({
                path: "WorkingDepartment",
                select: { DepartmentName: 1 }
            })
            .populate({
                path: "Region",
                select: { RegionName: 1 }
            })
            .populate({
                path: "Area",
                select: { Areaname: 1 }
            })
        return Response.json(project)
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";