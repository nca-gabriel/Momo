import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subTodoForm } from "@/utils/subtodo.schema";

export async function POST(req: Request) {
  const body = await req.json();

  const result = subTodoForm.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  const created = await prisma.subTodo.create({
    data: {
      title: result.data.title,
      description: result.data.description,
      todoId: result.data.todoId,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
