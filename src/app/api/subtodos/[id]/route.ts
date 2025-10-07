import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subTodoPatch } from "@/utils/subtodo.schema";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  // validate only editable fields
  const result = subTodoPatch.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.format() },
      { status: 400 }
    );
  }

  try {
    // update only editable fields
    const updated = await prisma.subTodo.update({
      where: { id }, // must be Mongo ObjectId
      data: {
        title: result.data.title,
        description: result.data.description ?? null,
        done: result.data.done ?? false,
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed updating subtodo. Make sure ID is valid." },
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
    await prisma.subTodo.delete({ where: { id } });

    return NextResponse.json(
      { message: "Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Faield to delete subtodo" },
      { status: 500 }
    );
  }
}
