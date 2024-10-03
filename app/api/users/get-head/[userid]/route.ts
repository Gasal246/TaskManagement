import connectDB from "@/lib/mongo";
import Users from "@/models/userCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }:{ params: { userid: string }}) {
    try {
        const user = await Users.findById(params.userid, { Role: 1, Area: 1, Region: 1, Department: 1 })
            .populate({
                path: "Area",
                select: { AreaHead: 1 },
                populate: {
                    path: "AreaHead",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
                }
            })
            .populate({
                path: "Region",
                select: { RegionHead: 1 },
                populate: {
                    path: "RegionHead",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
                }
            })
            .populate({
                path: "Department",
                select: { DepartmentHead: 1 },
                populate: {
                    path: "DepartmentHead",
                    select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 }
                }
            })
            .populate({
                path: "Addedby",
                select: { Name: 1, Email: 1, AvatarUrl: 1, Role: 1 } 
            });
            
        let head = {}
        switch(user?.Role){
            case 'staff': {
                head = user?.Area?.AreaHead
            }break;
            case 'area-head': {
                head = user?.Region?.RegionHead
            }break;
            case 'region-staff': {
                head = user?.Region?.RegionHead
            }break;
            case 'region-head': {
                head = user?.Department?.DepartmentHead
            }break;
            case 'dep-staff': {
                head = user?.Department?.DepartmentHead
            }break;
            case 'dep-head': {
                head = user?.Addedby
            }break;
            default: throw new Error("Unspecified Role For User.")
        }
        return Response.json(head);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
