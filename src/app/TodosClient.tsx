"use client";

import { useState, useEffect } from "react";
import { useTodos } from "@/hooks/useTodos";
import { TodoData } from "@/utils/todo.schema";
import Todos from "@/components/Todos";

export default function TodosClient({
  initialTodos,
}: {
  initialTodos: TodoData[];
}) {
  const [todos, setTodos] = useState<TodoData[]>(initialTodos);
  const { fetchTodos } = useTodos();

  const allTags: TodoData["tag"] = todos.flatMap((t) => t.tag ?? []);

  // useEffect(() => {
  //   fetchTodos().then(setTodos);
  // }, [fetchTodos]);

  return (
    <main>
      <header></header>
      <Todos todos={todos} tags={allTags} filterBy="today" />
    </main>
  );
}
