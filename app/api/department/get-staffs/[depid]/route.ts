import connectDB from "@/lib/mongo"
import Departments from "@/models/departmentsCollection";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { depid: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const regionid = searchParams.get("regionid");
        const areaid = searchParams.get("areaid");

        console.log(params.depid, regionid, areaid);

        if (regionid) {
            const staffs = await Departments.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(params.depid) } }, // select the department
                { $unwind: "$Staffs" }, // unwind the staffs array for processing individually
                { $match: { "Staffs.RegionId": new mongoose.Types.ObjectId(regionid) } }, // filter the staffs having given regionid
                // Lookup to get User details from Users collection
                {
                    $lookup: {
                        from: "users", // Collection to join with
                        localField: "Staffs.StaffId", // Field from Departments to match
                        foreignField: "_id", // Field from Users to match
                        as: "staffDetails" // Output array field
                    }
                },
                // Lookup to get Area details from Areas collection
                {
                    $lookup: {
                        from: "areas",
                        localField: "Staffs.AreaId",
                        foreignField: "_id",
                        as: "areaDetails"
                    }
                },
                // Lookup to get Region details from Regions collection
                {
                    $lookup: {
                        from: "regions",
                        localField: "Staffs.RegionId",
                        foreignField: "_id",
                        as: "regionDetails"
                    }
                },
                {
                    // group again by department _id and array of filtered staffs 
                    $group: {
                        _id: "$_id",
                        RegionId: { $first: "$Staffs.RegionId" },
                        Staffs: {
                            $push: {
                                StaffId: "$Staffs.StaffId",
                                Name: "$staffDetails.Name",
                                Email: "$staffDetails.Email",
                                AvatarUrl: "$staffDetails.AvatarUrl",
                                AreaId: "$Staffs.AreaId",
                                AreaName: "$areaDetails.Areaname",
                                RegionName: "$regionDetails.RegionName",
                            }
                        }
                    }
                }
            ])
            return Response.json(staffs[0]);
        }
        if (areaid) {
            const staffs = await Departments.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(params.depid) } },
                { $unwind: "$Staffs" },
                { $match: { "Staffs.AreaId": new mongoose.Types.ObjectId(areaid) } },
                {
                    $lookup: {
                        from: "users",
                        localField: "Staffs.StaffId",
                        foreignField: "_id",
                        as: "staffDetails"
                    }
                },
                {
                    $lookup: {
                        from: "areas",
                        localField: "Staffs.AreaId",
                        foreignField: "_id",
                        as: "areaDetails"
                    }
                },
                {
                    $lookup: {
                        from: "regions",
                        localField: "Staffs.RegionId",
                        foreignField: "_id",
                        as: "regionDetails"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        AreaId: { $first: "$Staffs.AreaId" },
                        Staffs: {
                            $push: {
                                StaffId: "$Staffs.StaffId",
                                Name: "$staffDetails.Name",
                                Email: "$staffDetails.Email",
                                AvatarUrl: "$staffDetails.AvatarUrl",
                                AreaId: "$Staffs.AreaId",
                                AreaName: "$areaDetails.Areaname",
                                RegionName: "$regionDetails.RegionName",
                            }
                        }
                    }
                }
            ])
            return Response.json(staffs[0])
        }
        const staffs = await Departments.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(params.depid) } },
            { $unwind: "$Staffs" },
            {
                $lookup: {
                    from: "users",
                    localField: "Staffs.StaffId",
                    foreignField: "_id",
                    as: "staffDetails"
                }
            },
            {
                $lookup: {
                    from: "areas",
                    localField: "Staffs.AreaId",
                    foreignField: "_id",
                    as: "areaDetails"
                }
            },
            {
                $lookup: {
                    from: "regions",
                    localField: "Staffs.RegionId",
                    foreignField: "_id",
                    as: "regionDetails"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    Staffs: {
                        $push: {
                            StaffId: "$Staffs.StaffId",
                            Name: "$staffDetails.Name",
                            Email: "$staffDetails.Email",
                            AvatarUrl: "$staffDetails.AvatarUrl",
                            AreaId: "$Staffs.AreaId",
                            AreaName: "$areaDetails.Areaname",
                            RegionName: "$regionDetails.RegionName",
                        }
                    }
                }
            }
        ])
        return Response.json(staffs[0]);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"
