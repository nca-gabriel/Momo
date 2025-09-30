import { prisma } from "@/utils/prisma";
import { TodoDataArr } from "@/utils/todo.schema";
import CalendarClient from "./CalendarClient";

export default async function Page() {
  const todos = await prisma.todo.findMany({
    include: { subTodos: true, tag: true },
  });

  // validate from db
  const parsed = TodoDataArr.parse(todos);

  const tags = await prisma.tag.findMany();

  return <CalendarClient initialTodos={parsed} initialTags={tags} />;
}
