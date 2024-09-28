import connectDB from "@/lib/mongo";
import Departments from "@/models/departmentsCollection";
import Projects from "@/models/projectCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { projectid: string }}){
    try {
        await Departments.find({}).limit(1);
        const project = await Projects.findById(params.projectid, { Flows: 1, Title: 1, Creator: 1, AdminId: 1, WorkingDepartment: 1 })
            .populate({
                path: "Flows",
                populate: {
                    path: "Creator",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Department: 1, Role: 1 },
                    populate:{
                        path: "Department",
                        select: { DepartmentName: 1 }
                    }
                }
            })
            .populate({
                path: "WorkingDepartment",
                select: { DepartmentName: 1 }
            });
        return Response.json(project);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";