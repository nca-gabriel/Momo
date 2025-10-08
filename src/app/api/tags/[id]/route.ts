import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tagForm } from "@/utils/tag.schema";
import { requireUser } from "@/lib/auth/auth.api";

export async function GET(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  const { id } = await context.params;
  const tag = await prisma.tag.findUnique({
    where: { id, userId: user.id },
  });
  if (!tag) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(tag);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  const { id } = await context.params;
  const body = await req.json();
  const result = tagForm.partial().safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.format() },
      { status: 400 }
    );
  }

  const tag = await prisma.tag.update({
    where: { id, userId: user.id },
    data: result.data,
  });

  return NextResponse.json(tag, { status: 200 });
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  const { id } = await context.params;
  try {
    await prisma.tag.delete({ where: { id, userId: user.id } });
    return NextResponse.json({ message: "deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
