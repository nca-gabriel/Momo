import { prisma } from "@/utils/prisma";
import TodosClient from "./TodosClient";
import { TodoDataArr } from "@/utils/todo.schema";

// SSR
export default async function page() {
  const todos = await prisma.todo.findMany({
    include: { subTodos: true, tag: true },
  });

  // validate from db
  const parsed = TodoDataArr.parse(todos);

  const tags = await prisma.tag.findMany();

  // CSR
  return <TodosClient initialTodos={parsed} initialTags={tags} />;
}
