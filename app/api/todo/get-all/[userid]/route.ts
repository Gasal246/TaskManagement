import connectDB from "@/lib/mongo";
import Todo from "@/models/todoCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET ( req: NextRequest, { params }:{ params: { userid: string } } ) {
    try {
        const todos = await Todo.find({ UserId: params.userid }).sort({ createdAt: -1 });
        return Response.json(todos);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
