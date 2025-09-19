import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { tagForm } from "@/utils/tag.schema";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const tag = await prisma.tag.findUnique({
    where: { id: params.id },
  });
  if (!tag) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(tag);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const result = tagForm.partial().safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.format() },
      { status: 400 }
    );
  }

  const tag = await prisma.tag.update({
    where: { id: params.id },
    data: result.data,
  });

  return NextResponse.json(tag, { status: 200 });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tag.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
