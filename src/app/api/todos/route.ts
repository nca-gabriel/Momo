import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { todoForm } from "@/utils/todo.schema";

// GET ALL TODOS
export async function GET() {
  const todos = await prisma.todo.findMany({
    include: { subTodos: true },
  });

  // get all tag IDs used
  const allTagIds = todos.flatMap((t) => t.tagIds ?? []);

  // fetch all relevant tags
  const tags = await prisma.tag.findMany({
    where: { id: { in: allTagIds } },
  });

  // attach tags to each todo
  const todosWithTags = todos.map((t) => ({
    ...t,
    tag: tags.filter((tag) => t.tagIds?.includes(tag.id)),
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

  const { subTodos, tag, ...todoFields } = result.data;

  const todo = await prisma.todo.create({
    data: {
      ...todoFields,
      subTodos: { create: subTodos ?? [] },
      tagIds: tag
        ? tag.map((t) => t.id).filter((id): id is string => !!id)
        : [],
    },
    include: { subTodos: true },
  });
  return NextResponse.json(todo, { status: 201 });
}

export async function DELETE() {
  await prisma.todo.deleteMany();
  return NextResponse.json({ message: "deleted", status: 202 });
}
