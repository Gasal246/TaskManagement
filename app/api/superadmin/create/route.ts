import connectDB from "@/lib/mongo";
import Superadmin from "@/models/superAdminCollection";
import { hash } from "bcrypt-ts";
import { NextRequest } from "next/server";

connectDB();

export async function POST(req: NextRequest){
    try {
        const { email, password, superadminid } = await req.json();
        if(!superadminid){
            return Response.json({ error: "Super admin id is not provided. "});
        }
        const superuser = await Superadmin?.findById(superadminid);
        if(!superuser){
            return Response?.json({ error: "You are not a authorized super admin."})
        }
        const existing = await Superadmin.findOne({ Email: email });
        if(existing){
            return Response.json({ error: "Already Exist with same email address "});
        }
        const hashedPassword = await hash(password, 10)
        const newSuperAdmin = new Superadmin({
            Email: email,
            Password: hashedPassword,
            SuperadminId: superadminid
        })
        const saved = await newSuperAdmin.save();
        return Response.json(saved);
    } catch (error) {
        console.log(error)
    }
}

export const dynamic = "force-dynamic"
