import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { todoSchema } from "@/utils/todo/todo.schema";

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
  const result = todoSchema.partial().safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.format() },
      { status: 400 }
    );
  }

  const todo = await prisma.todo.update({
    where: { id: params.id },
    data: result.data,
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
