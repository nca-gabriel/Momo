import { prisma } from "@/utils/prisma";
import { TodoDataArr } from "@/utils/todo.schema";
import CalendarClient from "./CalendarClient";

export default async function Page() {
  // Fetch todos with nested subTodos
  const todosRaw = await prisma.todo.findMany({ include: { subTodos: true } });
  const tags = await prisma.tag.findMany();

  // Attach tag object to each todo
  const todos = todosRaw.map((todo) => ({
    ...todo,
    tags: tags.find((t) => t.id === todo.tagId) ?? null,
  }));

  // Validate with Zod
  const parsed = TodoDataArr.parse(todos);

  return <CalendarClient initialTodos={parsed} initialTags={tags} />;
}
