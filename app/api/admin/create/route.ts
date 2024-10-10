import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Superadmin from "@/models/superAdminCollection";
import Admindatas from "@/models/adminDataCollection";
import Users from "@/models/userCollection";
import Departments from "@/models/departmentsCollection";

connectDB();

interface Body {
    name: string;
    email: string;
    country: string;
    province: string;
    city: string;
    phone: string;
    pin: string;
    departments: string
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions)
        const superadmin = await Superadmin.findById(session?.user?.id);
        if (!superadmin) {
            return new NextResponse("Authorization Error: Not A Super Admin", { status: 500 });
        }
        const formData = await req.formData();
        const { adminform } = Object.fromEntries(formData) as { adminform: string };
        const body = await JSON.parse(adminform) as Body;

        const newUser = new Users({
            Email: body.email,
            Name: body.name,
            Addedby: session?.user?.id,
            Status: 'active',
            Role: 'admin',
            Address: {
                Country: body.country,
                Province: body.province,
                City: body.city,
                Pin: body.pin
            }
        })
        const savedUser = await newUser.save();

        const depids = body?.departments.split(',');
        const demoDepartments = await Departments.find({ _id: { $in: depids } });
        let departmentIds = [];
        for (const demodep of demoDepartments) {
            const newDep = new Departments({
                AdminId: savedUser?._id,
                DepartmentName: 'Untitled Department',
                MaximumStaffs: demodep?.MaximumStaffs,
                AllowProjects: demodep?.AllowProjects,
                AllowTasks: demodep?.AllowTasks,
            })
            const savedDep = await newDep.save();
            departmentIds.push(savedDep?._id.toString())
        }

        const newAdmin = new Admindatas({
            AdminId: savedUser?._id,
            Departments: departmentIds
        })

        const savedAdmin = await newAdmin.save();
        return Response.json(savedAdmin);   
    } catch (error) {
        console.log(error)
    }
}

export const dynamic = "force-dynamic";
