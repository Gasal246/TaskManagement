import connectDB from "@/lib/mongo"
import Projects from "@/models/projectCollection";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
    try {
        const results = await Projects.aggregate([
            {
                $facet: {
                    new: [
                        { $match: { AccessTo: new mongoose.Types.ObjectId(params?.userid), IsApproved: false } },
                        { $count: "count" },
                    ],
                    ongoing: [
                        { $match: { AccessTo: new mongoose.Types.ObjectId(params?.userid), IsApproved: true, IsCompleted: false || null } },
                        { $count: "count" },
                    ],
                    owned: [
                        { $match: { Creator: new mongoose.Types.ObjectId(params?.userid) } },
                        { $count: "count" },
                    ],
                    completed: [
                        { $match: { AccessTo: new mongoose.Types.ObjectId(params?.userid), IsCompleted: true } },
                        { $count: "count" },
                    ],
                    all: [
                        { $match: { AccessTo: new mongoose.Types.ObjectId(params?.userid) } },
                        { $count: "count" },
                    ]
                }
            }
        ]);

        const chartData = [
            {
                projectType: "ongoing",
                count: results[0].ongoing.length ? results[0].ongoing[0].count : 0,
                fill: "var(--color-ongoing)"
            },
            {
                projectType: "owned",
                count: results[0].owned.length ? results[0].owned[0].count : 0,
                fill: "var(--color-owned)"
            },
            {
                projectType: "completed",
                count: results[0].completed.length ? results[0].completed[0].count : 0,
                fill: "var(--color-completed)"
            },
            {
                projectType: "new",
                count: results[0].new.length ? results[0].new[0].count : 0,
                fill: "var(--color-new)"
            },
            results[0].all.length ? results[0].all[0].count : 0
        ];

        return Response.json(chartData)
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error.", { status: 500 });
    }
}

export const dynaimc = "force-dynamic"