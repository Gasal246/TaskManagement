import connectDB from "@/lib/mongo"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import Tasks from "@/models/taskCollection";
import Users from "@/models/userCollection";
import Departments from "@/models/departmentsCollection";
import Regions from "@/models/regionCollection";
import Areas from "@/models/areaCollection";

connectDB();

interface Activity {
    Title: string;
    Description: string;
    Priority: string;
    Completed: boolean;
}

interface Body {
    TaskName: string;
    Creator: string;
    Description: string;
    ForwardType: 'individual' | 'public';
    AssignedUser?: string;
    Projectid?: string;
    Deadline: string;
    SelectedStaffs: string[] | [],
    Activities: Activity[] | [],
    Priority: string;
    [key: string]: any; // other dynamic keys
}

export async function POST(req: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorised Access to req", { status: 401 });
        }
        const formData = await req.formData();
        const { taskform } = Object.fromEntries(formData) as { taskform: string };
        const body = await JSON.parse(taskform) as Body;

        console.log(body)

        const user = await Users.findById(body?.Creator, { Role: 1, Area: 1, Region: 1, Department: 1 })
        .populate({
            path: "Area",
            select: { AreaHead: 1 }
        });

        let forwardlist: string[] = [];
        if(body?.ForwardType == 'public'){
            switch(user?.Role){
                case 'admin': {
                    const departments = await Departments.find({ AdminId: body?.Creator }, { DepartmentHead: 1 });
                    const depHeads = departments?.map((dep: any) => dep?.DepartmentHead );
                    forwardlist = [ body?.Creator, ...depHeads ];
                }break;
                case 'dep-head': {
                    const department = await Departments.findById(user?.Department, { Regions: 1 })
                        .populate({
                            path: "Regions.RegionId",
                            select:{ RegionHead: 1 }
                        });
                    const regHeads = await department?.Regions?.map((reg: any) => reg?.RegionId?.RegionHead );
                    forwardlist = [ body?.Creator, ...regHeads ]
                }break;
                case 'dep-staff': {
                    const department = await Departments.findById(user?.Department, { DepartmentHead: 1 });
                    forwardlist = [ body?.Creator, department?.DepartmentHead ]
                }break;
                case 'region-head': {
                    const department = await Departments.findById(user?.Department, { DepartmentHead: 1 });
                    forwardlist = [ body?.Creator, department?.DepartmentHead ] 
                }break;
                case 'region-staff': {
                    const region = await Regions.findById(user?.Region, { RegionHead: 1 });
                    forwardlist = [ body?.Creator, region?.RegionHead ];
                }
                case 'area-head': {
                    const region = await Regions.findById(user?.Region, { RegionHead: 1 });
                    forwardlist = [ body?.Creator, region?.RegionHead ];
                }break;
                case 'staff': {
                    const area = await Areas.findById(user?.Area, { AreaHead: 1 });
                    forwardlist = [ body?.Creator, area?.AreaHead ];
                }break;
                default: {
                    throw new Error("User Specification Not Valid "+user?.Role);
                }
            }
        }

        const newTask = new Tasks({
            TaskName: body?.TaskName,
            Creator: body?.Creator,
            Description: body?.Description,
            ForwardList: forwardlist,
            ForwardType: body?.ForwardType,
            AssignedUser: body?.AssignedUser || null,
            ProjectId: body?.Projectid,
            Deadline: body?.Deadline,
            Activities: body?.Activities,
            Status: 'pending',
            Priority: body?.Priority,
            AdminId: user?.Role == 'admin' ? user?._id : user?.Addedby,
        })
        const savedtask = await newTask.save();
        return Response.json(savedtask);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic"