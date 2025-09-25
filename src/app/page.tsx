import { prisma } from "@/utils/prisma";
import TodosClient from "./TodosClient";
import { TodoDataArr } from "@/utils/todo.schema";

// SSR
export default async function page() {
  const todosRaw = await prisma.todo.findMany({
    include: { subTodos: true },
  });

  const tags = await prisma.tag.findMany({});

  const todos = todosRaw.map((todo) => ({
    ...todo,
    tags: tags.find((tag) => tag.id === todo.tagId) ?? null, // ✅ single object
  }));

  // validate from db
  const parsed = TodoDataArr.parse(todos);

  // CSR
  return <TodosClient initialTodos={parsed} initialTags={tags} />;
}
