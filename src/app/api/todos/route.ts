import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { todoForm } from "@/utils/todo.schema";

// GET ALL TODOS
export async function GET() {
  const todos = await prisma.todo.findMany({
    include: { subTodos: true },
  });

  // fetch all relevant tags
  const allTagIds = todos.map((t) => t.tagId).filter(Boolean) as string[];
  const tags = await prisma.tag.findMany({
    where: { id: { in: allTagIds } },
  });

  // attach single tag object to each todo
  const todosWithTags = todos.map((t) => ({
    ...t,
    tag: tags.find((tag) => tag.id === t.tagId) ?? null,
  }));

  return NextResponse.json(todosWithTags);
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

  const { subTodos, tagId, ...todoFields } = result.data;

  const todo = await prisma.todo.create({
    data: {
      ...todoFields,
      subTodos: { create: subTodos ?? [] },
      tagId: tagId && tagId.trim() !== "" ? tagId : undefined,
    },
    include: { subTodos: true },
  });

  return NextResponse.json(todo, { status: 201 });
}

// DELETE ALL TODOS
export async function DELETE() {
  await prisma.todo.deleteMany();
  return NextResponse.json({ message: "deleted", status: 202 });
}
