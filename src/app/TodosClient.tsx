"use client";

import { useTodos } from "@/hooks/useTodos";
import { TodoData } from "@/utils/todo.schema";
import Todos from "@/components/Todos";

export default function TodosClient({
  initialTodos,
}: {
  initialTodos: TodoData[];
}) {
  const { todosQuery } = useTodos();

  const todos = todosQuery.data ?? initialTodos;

  const allTags: TodoData["tag"] = todos.flatMap((t) => t.tag ?? []);

  return (
    <main>
      <header>
        <h3>Today</h3>
      </header>
      <Todos todos={todos} tags={allTags} filterBy="today" />
    </main>
  );
}
