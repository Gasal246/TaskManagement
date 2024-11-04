import connectDB from "@/lib/mongo"
import Projects from "@/models/projectCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET ( req: NextRequest, { params }: { params: { adminid: string }}) {
    try {
        const projects = await Projects.find({ AdminId: params.adminid, IsDeleted: false });
        const ongoing = projects?.filter((project: any) => project?.IsApproved == true  );
        const notApproved = projects?.filter(( project: any ) => project?.IsApproved == false );

        return Response.json({
            ongoing: ongoing,
            waitingApproval: notApproved
        })
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic;"