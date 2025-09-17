import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { todoSchema } from "@/utils/todo/todo.schema";

// GET ALL TODOS
export async function GET() {
  const todos = await prisma.todo.findMany({
    include: { subTodos: true, tag: true },
  });

  return NextResponse.json(todos);
}

// POST REQUEST
export async function POST(req: Request) {
  const body = await req.json();
  const result = todoSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const todo = await prisma.todo.create({ data: result.data });
  return NextResponse.json(todo, { status: 201 });
}
