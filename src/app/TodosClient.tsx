"use client";

import { useTodos } from "@/hooks/useTodos";
import { useTags } from "@/hooks/useTags"; // <-- import your hook
import { TodoData } from "@/utils/todo.schema";
import { TagData } from "@/utils/tag.schema";
import Todos from "@/components/Todos";

export default function TodosClient({
  initialTodos,
  initialTags,
}: {
  initialTodos: TodoData[];
  initialTags: TagData[];
}) {
  const { todosQuery } = useTodos();
  const { tagsQuery } = useTags(); // <-- get updated tags

  const todos = todosQuery.data ?? initialTodos;
  const tags = tagsQuery.data ?? initialTags; // <-- use live tags

  return (
    <main className="">
      <Todos todos={todos} tags={tags} filterBy="today" title="Today!" />
    </main>
  );
}
