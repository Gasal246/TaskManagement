import connectDB from "@/lib/mongo";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Clients from "@/models/clientCollection";
import Users from "@/models/userCollection";

connectDB();

interface Body {
    shortname: string;
    fullname: string;
    details: string;
    region: string;
    area: string;
    contactinfo: any[];
    [key: string]: any;
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) return new NextResponse("Un Authorized Access", { status: 401 });

        const formData = await req.formData();
        const { clientform } = Object.fromEntries(formData) as { clientform: string };
        const body = await JSON.parse(clientform) as Body;

        const user = await Users.findById(session?.user?.id, { Role: 1, Addedby: 1 });

        const existing = await Clients.findOne({ ShortName: body?.shortname }, { _id: 1 });
        if (existing) {
            const updatedClient = await Clients.findByIdAndUpdate(existing?._id, { $push: { Addedby: session?.user?.id } }, { new: true });
            return Response.json(updatedClient);
        }
        const newClient = new Clients({
            ShortName: body?.shortname,
            FullName: body?.fullname,
            Region: body?.region,
            Area: body?.area,
            Details: body?.details,
            AddedBy: [session?.user?.id],
            AdminId: user?.Role == 'admin' ? session?.user?.id : user?.Addedby,
            ContactInfo: body?.contactinfo
        })
        const savedClient = await newClient.save();
        return Response.json(savedClient);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic";
