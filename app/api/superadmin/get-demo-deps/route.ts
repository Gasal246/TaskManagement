import connectDB from "@/lib/mongo";
import Departments from "@/models/departmentsCollection";
import { NextRequest } from "next/server";

connectDB();

export async function GET(req: NextRequest){
    try {
        const getDemoDeps = await Departments.find({ IsDemo: true });
        return Response.json(getDemoDeps);
    } catch (error) {
        console.log(error);
    }
}

export const dynamic = "force-dynamic";
