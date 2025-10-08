import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/auth.api";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    const { id } = await context.params;

    const todos = await prisma.todo.findMany({
      where: { tagId: id, userId: user.id },
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
