import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const todos = await prisma.todo.findMany({
      where: { tagId: id },
      include: { subTodos: true },
      orderBy: { todoDate: "asc" },
    });

    if (!todos)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}
