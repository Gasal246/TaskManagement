import connectDB from "@/lib/mongo"
import Todo from "@/models/todoCollection";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

connectDB();

interface Body {
    content: string;
    [key: string]: any;
}

export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions);
        if(!session?.user?.id){
            throw new Error("User Not Correctly Authenticated!!!")
        }
        const formdata = await req.formData();
        const body = Object.fromEntries(formdata) as Body;
        const newTodo = new Todo({
            UserId: session?.user?.id,
            Content: body?.content,
        })
        const savedTodo = await newTodo.save();
        return Response.json(savedTodo);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export const dynamic = "force-dynamic"
