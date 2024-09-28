import connectDB from "@/lib/mongo";
import { NextRequest, NextResponse } from "next/server";
import Admindatas from "@/models/adminDataCollection";

connectDB();

export async function GET(req: NextRequest) {
    try {
        const searchParams: any = req.nextUrl.searchParams;
        const filter: AdminDataFilters = searchParams.get('filter');
        const fromDate = new Date(searchParams.get('from'));
        const toDate = new Date(searchParams.get('to'));
        let query = {};

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        if (filter === 'today') {
            query = {
                createdAt: {
                    $gte: startOfToday,
                    $lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)
                }
            };
        } else if (filter === 'month') {
            query = {
                createdAt: {
                    $gte: startOfMonth,
                    $lt: new Date(today.getFullYear(), today.getMonth() + 1, 1)
                }
            };
        } else if (filter === 'days'){
            query = {
                createdAt: {
                    $gte: fromDate,
                    $lt: toDate
                }
            };
        }
        
        const admins = await Admindatas.find(query).populate({
            path: "AdminId",
            select: { Name: 1, Email: 1, createdAt: 1, updatedAt: 1, AvatarUrl: 1 }
        });

        return NextResponse.json(admins);
    } catch (error) {
        console.log(error)
        return new NextResponse(`Internal Server Error: ${error}`, { status: 500 });
    }
}

export const dynamic = "force-dynamic";

