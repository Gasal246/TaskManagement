import connectDB from "@/lib/mongo"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Clients from "@/models/clientCollection";
import Projects from "@/models/projectCollection";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) return new NextResponse("Un Authorized Access", { status: 401 });
        const { clientid } = await req.json();
        const deletedClient = await Clients.findByIdAndDelete(clientid);
        const projectids = await Projects.find({ ClientId: clientid }, { _id: 1 });
        const deleteProjectPromise = projectids.map(async (project: any) => {
            await Projects.findByIdAndDelete(project?._id)
        })
        const deletedProjects = await Promise.all(deleteProjectPromise);
        return Response.json(deletedClient)
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";