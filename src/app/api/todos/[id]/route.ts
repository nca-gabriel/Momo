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

  const { subTodos, tag, ...todoFields } = result.data;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      if (subTodos) {
        // get existing subtodos
        const existing = await tx.subTodo.findMany({
          where: { todoId: id },
          select: { id: true },
        });
        const existingIds = existing.map((st) => st.id);

        const incomingIds = subTodos.filter((st) => st.id).map((st) => st.id!);

        // delete removed subtodos
        const toDelete = existingIds.filter(
          (eid) => !incomingIds.includes(eid)
        );
        if (toDelete.length > 0) {
          await tx.subTodo.deleteMany({ where: { id: { in: toDelete } } });
        }

        // inside PATCH transaction
        for (const st of subTodos) {
          if (st.id && existingIds.includes(st.id)) {
            // update
            await tx.subTodo.update({
              where: { id: st.id },
              data: {
                title: st.title,
                description: st.description,
                done: st.done ?? false,
              },
            });
          } else {
            // create
            await tx.subTodo.create({
              data: {
                title: st.title,
                description: st.description,
                done: st.done ?? false,
                todoId: id,
              },
            });
          }
        }

        // create new subtodos
        const newSubs = subTodos.filter((st) => !st.id);
        if (newSubs.length > 0) {
          await tx.subTodo.createMany({
            data: newSubs.map((st) => ({
              title: st.title,
              description: st.description,
              done: st.done ?? false,
              todoId: id, // Prisma converts to ObjectId internally
            })),
          });
        }
      }

      // update todo itself
      const updatedTodo = await tx.todo.update({
        where: { id },
        data: {
          ...todoFields,
          // tags: only create new for now
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

      return updatedTodo;
    });

    return NextResponse.json(updated, { status: 200 });
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
