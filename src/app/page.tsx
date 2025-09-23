import { prisma } from "@/utils/prisma";
import TodosClient from "./TodosClient";
import { TodoDataArr } from "@/utils/todo.schema";

// SSR
export default async function page() {
  const todosRaw = await prisma.todo.findMany({
    include: { subTodos: true },
  });

  const allTagIds = todosRaw.flatMap((t) => t.tagIds ?? []);

  const tags = await prisma.tag.findMany({
    where: { id: { in: allTagIds } },
  });

  const todos = todosRaw.map((todo) => ({
    ...todo,
    tag: tags.filter((tag) => todo.tagIds.includes(tag.id)),
  }));

  // validate from db
  const parsed = TodoDataArr.parse(todos);

  // CSR
  return <TodosClient initialTodos={parsed} initialTags={tags} />;
}
