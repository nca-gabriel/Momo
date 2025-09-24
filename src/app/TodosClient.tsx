"use client";

import { useTodos } from "@/hooks/useTodos";
import { TodoData } from "@/utils/todo.schema";
import Todos from "@/components/Todos";
import { TagData } from "@/utils/tag.schema";

export default function TodosClient({
  initialTodos,
  initialTags,
}: {
  initialTodos: TodoData[];
  initialTags: TagData[];
}) {
  const { todosQuery } = useTodos();

  const todos = todosQuery.data ?? initialTodos;

  return (
    <main className="">
      <Todos todos={todos} tags={initialTags} filterBy="today" title="Today!" />
    </main>
  );
}
