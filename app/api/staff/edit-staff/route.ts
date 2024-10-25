import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

connectDB();

interface Body {
    staffid: string;
    Name: string;
    Email: string;
    Region: string;
    Area: string;
    Phone: string;
    Country: string;
    City: string;
    Province: string;
    Pin: string
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if(!session){
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const formData = await req.formData();
        const { usereditform } = Object.fromEntries(formData) as { usereditform: string };
        const body = await JSON.parse(usereditform) as Body;

        // If the same email is not existing for any other users.
        const existing = await Users.findOne({ Email: body?.Email }); 
        if(existing && existing?._id?.toString() !== body?.staffid){
            return Response.json({ existing: true });
        }
        const updatedStaff = await Users.findByIdAndUpdate(body?.staffid, { 
            Name: body?.Name,
            Email: body?.Email,
            Region: body?.Region,
            Area: body?.Area,
            Phone: body?.Phone,
            Address: {
                Country: body?.Country,
                Province: body?.Province,
                City: body?.City,
                Pin: body?.Pin
            }
         });
        return Response.json(updatedStaff);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
