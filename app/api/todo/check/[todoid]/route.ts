import connectDB from "@/lib/mongo";
import Todo from "@/models/todoCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST ( req: NextRequest, { params }: { params: { todoid: string }}) {
    try {
        const { check } = await req.json();
        console.log(check)
        const updatedTodo = await Todo.findByIdAndUpdate(params.todoid, { Status: check }, { new: true });
        return Response.json(updatedTodo);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";
