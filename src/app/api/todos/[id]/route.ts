import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { todoPatch } from "@/utils/todo.schema";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const todo = await prisma.todo.findUnique({
    where: { id: params.id },
    include: { subTodos: true, tag: true },
  });
  if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(todo);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const result = todoPatch.partial().safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.format() },
      { status: 400 }
    );
  }

  const { subTodos, tag, ...todoFields } = result.data;

  try {
    const todo = await prisma.todo.update({
      where: { id: params.id },
      data: {
        ...todoFields,
        subTodos: subTodos
          ? {
              create: subTodos.map((st) => ({
                title: st.title,
                done: st.done ?? false,
              })),
            }
          : undefined,
        tag: tag
          ? {
              create: tag.map((t) => ({
                name: t.name,
                color: t.color,
              })),
            }
          : undefined,
      },
      include: { subTodos: true, tag: true },
    });

    return NextResponse.json(todo, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.todo.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ err: "Failed to delete todo" }, { status: 500 });
  }
}
