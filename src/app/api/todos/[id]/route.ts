import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { todoPatch } from "@/utils/todo.schema";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const todo = await prisma.todo.findUnique({
    where: { id },
    include: { subTodos: true },
  });

  const tag = todo?.tagId
    ? await prisma.tag.findUnique({ where: { id: todo.tagId } })
    : null;

  if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...todo, tag });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const result = todoPatch.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.format() },
      { status: 400 }
    );
  }

  const { subTodos, ...todoFields } = result.data;

  try {
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: {
        ...todoFields,
      },
      include: { subTodos: true }, // still include subtodos for frontend
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ message: "deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ err: "Failed to delete todo" }, { status: 500 });
  }
}
