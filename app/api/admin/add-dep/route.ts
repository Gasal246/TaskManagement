import connectDB from "@/lib/mongo"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { promises as fs } from 'fs';
import path from "path";
import Admindatas from "@/models/adminDataCollection";
import Users from "@/models/userCollection";
import Departments from "@/models/departmentsCollection";

connectDB();

interface Body {
    adminId: string;
    depId: string;
    [key: string]: any; // For dynamic document properties
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized Request Error.", { status: 401 });
        }
        const formdata = await req.formData();
        const body = Object.fromEntries(formdata) as Body;
        const demoDep = await Departments.findById(body?.depId);
        const adminData = await Admindatas.findById(body?.adminId);
        const newDep = new Departments({
            DepartmentName: demoDep?.DepartmentName,
            AllowProjects: demoDep?.AllowProjects,
            AllowTasks: demoDep?.AllowTasks,
            MaximumStaffs: demoDep?.MaximumStaffs,
            AdminId: adminData?.AdminId
        });
        const savedDep = await newDep.save();
        const updatedAdminData = await Admindatas.findByIdAndUpdate(body?.adminId, { $push: { Departments: savedDep?._id }}, { new: true });
        return Response.json(updatedAdminData);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic"