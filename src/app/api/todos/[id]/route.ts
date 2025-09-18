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

  const todo = await prisma.todo.update({
    where: { id: params.id },
    data: {
      ...todoFields,
      subTodos: subTodos
        ? {
            updateMany: subTodos.map((st) => ({
              where: { id: st.id },
              data: st,
            })),
          }
        : undefined,
      tag: tag
        ? {
            updateMany: tag.map((t) => ({
              where: { id: t.id },
              data: t,
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json(todo, { status: 202 });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  await prisma.todo.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "deleted", status: 202 });
}
