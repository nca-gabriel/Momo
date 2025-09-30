import { prisma } from "@/utils/prisma";
import TagTodosClient from "./TagTodosClient";
import { TodoDataArr } from "@/utils/todo.schema";
import { notFound } from "next/navigation";

type Params = { params: { id: string } };

export default async function Page({ params }: Params) {
  const { id } = await params;
  const tag = await prisma.tag.findUnique({
    where: { id: id },
  });

  if (!tag) return notFound();

  const todosRaw = await prisma.todo.findMany({
    where: { tagId: tag.id },
    include: { subTodos: true },
    orderBy: { todoDate: "asc" },
  });

  const todos = TodoDataArr.parse(todosRaw);
  const tags = await prisma.tag.findMany();

  return <TagTodosClient tag={tag} initialTodos={todos} initialTags={tags} />;
}
