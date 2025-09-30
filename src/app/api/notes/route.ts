import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { noteData, noteForm } from "@/utils/note.schema";

export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
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
    },
  });

  return NextResponse.json(tag, { status: 201 });
}
