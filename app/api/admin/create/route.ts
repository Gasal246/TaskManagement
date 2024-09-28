import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Superadmin from "@/models/superAdminCollection";
import Admindatas from "@/models/adminDataCollection";
import Users from "@/models/userCollection";
import Departments from "@/models/departmentsCollection";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions)
        const superadmin = await Superadmin.findById(session?.user?.id);
        if (!superadmin) {
            return new NextResponse("Authorization Error: Not A Super Admin", { status: 500 });
        }
        const formdata = await req.formData();
        const data = Object.fromEntries(formdata) as NewAdminType;
        const newAdminUser = new Users({
            Email: data?.email,
            Name: data?.name,
            Addedby: session?.user?.id,
            Status: 'active',
            Role: 'admin'
        })
        const adminUser = await newAdminUser.save();
        const depIds = data?.departments.split(',');
        const demoDepartments = await Departments.find({ _id: { $in: depIds } });
        const departmentIds: string[] = [];
        for (const demodep of demoDepartments) {
            const newDep = new Departments({
                AdminId: adminUser?._id,
                DepartmentName: demodep?.DepartmentName,
                MaximumStaffs: demodep?.MaximumStaffs,
                AllowProjects: demodep?.AllowProjects,
                AllowTasks: demodep?.AllowTasks,
            })
            const savedDep = await newDep.save();
            departmentIds.push(savedDep?._id.toString())
        }
        const newAdminData = new Admindatas({
            AdminId: adminUser?._id,
            Departments: departmentIds
        })
        const savedAdminData = await newAdminData.save();
        return Response.json(savedAdminData)
    } catch (error) {
        console.log(error)
    }
}

export const dynamic = "force-dynamic";
