import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { tagForm } from "@/utils/tag.schema";

export async function GET() {
  const tags = await prisma.tag.findMany();
  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = tagForm.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { errors: result.error.flatten() },
      { status: 400 }
    );
  }

  const tag = await prisma.tag.create({
    data: {
      name: result.data.name,
      color: result.data.color,
    },
  });

  return NextResponse.json(tag, { status: 201 });
}
