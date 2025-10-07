import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tagForm } from "@/utils/tag.schema";
import { requireUser } from "@/lib/auth/auth.api";

export async function GET() {
  const user = await requireUser();
  const tags = await prisma.tag.findMany({
    where: { userId: user.id },
    orderBy: { name: "desc" },
  });
  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const user = await requireUser();
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
      userId: user.id,
    },
  });

  return NextResponse.json(tag, { status: 201 });
}
