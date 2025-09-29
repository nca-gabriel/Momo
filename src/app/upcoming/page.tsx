import { prisma } from "@/utils/prisma";
import { TodoDataArr } from "@/utils/todo.schema";
import UpcomingClient from "./UpcomingClient";

export default async function Page() {
  const todosRaw = await prisma.todo.findMany({
    include: { subTodos: true },
  });

  const tags = await prisma.tag.findMany();

  const todos = todosRaw.map((todo) => ({
    ...todo,
    tags: tags.find((tag) => tag.id === todo.tagId) ?? null,
  }));

  const parsed = TodoDataArr.parse(todos);

  return <UpcomingClient initialTodos={parsed} initialTags={tags} />;
}
