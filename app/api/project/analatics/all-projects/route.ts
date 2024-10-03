import connectDB from "@/lib/mongo";
import Projects from "@/models/projectCollection";
import Users from "@/models/userCollection";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { projectid: string }}){
    try {
        const { searchParams } = new URL(req.url);
        const userid = new mongoose.Types.ObjectId(searchParams.get('userid')!);
        const filter = searchParams.get('filter') || '';
        let query = {};
        switch (filter) {
            case 'all':
                query = { AccessTo: userid };
                break;
            case 'new':
                query = { AccessTo: userid, IsApproved: false };
                break;
            case 'ongoing':
                query = { AccessTo: userid, IsApproved: true };
                break;
            case 'owned':
                query = { Creator: userid };
                break;
            case 'ended':
                query = { AccessTo: userid, IsCompleted: true };
                break;
            case 'deleted':
                query = { AccessTo: userid, IsDeleted: true };
                break;
            default:
                throw new Error("Invalid case type");
        }
        const analytics = await Projects.aggregate([
            { $match: query },
            {
                $facet: {
                    unopenedProjects: [
                        { $match: { OpenedBy: { $ne: userid } } },
                        { $project: { _id: 1 } }
                    ],
                    approvedProjectIds: [
                        { $match: { IsApproved: true } },
                        { $project: { _id: 1 } }
                    ],
                    notApprovedProjectIds: [
                        { $match: { IsApproved: false } },
                        { $project: { _id: 1 } }
                    ],
                    completedProjectIds: [
                        { $match: { IsCompleted: true } },
                        { $project: { _id: 1 } }
                    ]
                }
            }
        ])
        return Response.json(analytics[0])
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";