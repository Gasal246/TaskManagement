import connectDB from "@/lib/mongo"
import Admindatas from "@/models/adminDataCollection";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest){
    try {
        const searchParams: any = req.nextUrl.searchParams;
        const searchTerm: string = searchParams.get('search');

        const searchRegex = new RegExp(searchTerm, 'i')

        const admins = await Admindatas.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "AdminId",
                    foreignField: "_id",
                    as: "adminDetails"
                }
            },
            {
                $unwind: "$adminDetails"
            },
            {
                $match: {
                    $or: [
                        { "adminDetails.Name": { $regex: searchRegex } },
                        { "adminDetails.Email": { $regex: searchRegex } }
                    ]
                }
            },
            {
                $project: {
                    "adminDetails.Name": 1,
                    "adminDetails.Email": 1,
                    "adminDetails.AvatarUrl": 1,
                    "createdAt": 1,
                    "updatedAt": 1
                }
            }
        ]);

        return Response.json(admins)
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
