import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { noteData, noteForm } from "@/utils/note.schema";
import { requireUser } from "@/lib/auth/auth.api";

export async function GET() {
  const user = await requireUser();
  const notes = await prisma.note.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json();
  const result = noteForm.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const tag = await prisma.note.create({
    data: {
      name: result.data.name,
      description: result.data.description ?? "",
      color: result.data.color,
      userId: user.id,
    },
  });

  return NextResponse.json(tag, { status: 201 });
}
