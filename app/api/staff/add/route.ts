import connectDB from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Users from "@/models/userCollection";

connectDB();

interface Body {
    Name: string;
    Email: string;
    Country: string | null;
    Province: string | null;
    City: string | null;
    Skills: string[] | [],
    Phone: string | null;
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized Request Error.", { status: 401 });
        }
        const formData = await req.formData();
        const { userform } = Object.fromEntries(formData) as { userform: string };
        const body = await JSON.parse(userform) as Body;
        console.log(body);
        const existing = await Users.findOne({ Email: body?.Email, Addedby: session?.user?.id, IsDeleted: false });
        if(existing){
            return Response.json({ existing: true });
        }

        const newUser = new Users({
            Email: body?.Email,
            Name: body?.Name,
            Skills: body?.Skills,
            Address: {
                Country: body?.Country,
                Province: body?.Province,
                City: body?.City
            },
            Phone: body?.Phone,
            Status: 'unverified',
            InitialEntry: true,
            Addedby: session?.user?.id,
            Role: 'staff'
        });
        const savedUser = await newUser.save();
        return Response.json(savedUser);
    } catch (error) {
        console.error("Error:", error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
