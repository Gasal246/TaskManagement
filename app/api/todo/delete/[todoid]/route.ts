import connectDB from "@/lib/mongo";
import Todo from "@/models/todoCollection";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST ( req: NextRequest, { params }: { params: { todoid: string }}) {
    try {
        const deleteTodo = await Todo.findByIdAndDelete(params.todoid);
        return Response.json(deleteTodo);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic";