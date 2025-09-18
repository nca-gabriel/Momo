import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { todoForm } from "@/utils/todo.schema";

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
  const result = todoForm.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const todo = await prisma.todo.create({
    data: {
      ...result.data,
      subTodos: { create: result.data.subTodos ?? [] },
      tag: { create: result.data.tag ?? [] },
    },
  });
  return NextResponse.json(todo, { status: 201 });
}

export async function DELETE() {
  await prisma.todo.deleteMany();
  return NextResponse.json({ message: "deleted", status: 202 });
}
