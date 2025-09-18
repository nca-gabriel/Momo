import { prisma } from "@/utils/prisma";
import Todos from "./TodosClient";
import { TodoDataArr } from "@/utils/todo.schema";

// SSR
export default async function page() {
  const todos = await prisma.todo.findMany({
    include: { subTodos: true, tag: true },
  });

  // validate from db
  const parsed = TodoDataArr.parse(todos);

  // CSR
  return <Todos initialTodos={parsed} />;
}
