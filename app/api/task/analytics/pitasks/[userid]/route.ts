import connectDB from "@/lib/mongo";
import Tasks from "@/models/taskCollection";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest, { params }: { params: { userid: string } }) {
  try {
    const result = await Tasks.aggregate([
      {
        $match: {
          $or: [
            { Creator: new mongoose.Types.ObjectId(params?.userid) },
            { AcceptedBy: new mongoose.Types.ObjectId(params?.userid) },
            { ForwardList: new mongoose.Types.ObjectId(params?.userid) },
            { AssignedUser: new mongoose.Types.ObjectId(params?.userid) }
          ],
        },
      },
      {
        $addFields: {
          allActivitiesCompleted: {
            $eq: [
              { $size: "$Activities" },
              { $size: { $filter: { input: "$Activities", as: "activity", cond: { $eq: ["$$activity.Completed", true] } } } }
            ]
          },
          isAcceptedByUser: { $eq: ["$AcceptedBy", new mongoose.Types.ObjectId(params?.userid)] }, // Check if AcceptedBy is the user
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$allActivitiesCompleted", true] }, // Check if all activities are completed
              "completed",
              {
                $cond: [
                  { $eq: ["$AcceptedBy", null] }, // Check if AcceptedBy is null (not accepted)
                  "notAccepted",
                  {
                    $cond: [
                      { $eq: ["$isAcceptedByUser", true] }, // Check if task is accepted by the user
                      {
                        $cond: [
                          { $eq: ["$Status", "completed"] }, // Check if task is completed
                          "completed",
                          "ongoing" // Ongoing if status is not completed
                        ]
                      },
                      "pending" // Tasks accepted by the user but activities are incomplete
                    ]
                  }
                ]
              }
            ]
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          taskStats: {
            $push: {
              taskType: "$_id",
              count: "$count"
            }
          },
          totalTasks: { $sum: "$count" } // Add total task count
        }
      },
      {
        $unwind: "$taskStats"
      },
      {
        $project: {
          taskType: "$taskStats.taskType",
          count: "$taskStats.count",
          totalTasks: 1, // Keep total tasks in the output
          fill: {
            $switch: {
              branches: [
                { case: { $eq: ["$taskStats.taskType", "completed"] }, then: "var(--color-completed)" },
                { case: { $eq: ["$taskStats.taskType", "pending"] }, then: "var(--color-pending)" },
                { case: { $eq: ["$taskStats.taskType", "notAccepted"] }, then: "var(--color-notAccepted)" },
                { case: { $eq: ["$taskStats.taskType", "ongoing"] }, then: "var(--color-ongoing)" }
              ],
              default: "var(--color-default)"
            }
          }
        }
      },
    ]);

    // Default chart data with total task count
    const chartTypes = ["ongoing", "pending", "completed", "notAccepted"];
    const totalTasks = result[0]?.totalTasks || 0;

    const chartData = chartTypes.map(type => ({
      taskType: type,
      count: result.find(r => r.taskType === type)?.count || 0,
      fill: result.find(r => r.taskType === type)?.fill || `var(--color-${type})`,
      totalTasks // Include total task count in each item for reference if needed
    }));
    return Response.json([...chartData, totalTasks])
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic";