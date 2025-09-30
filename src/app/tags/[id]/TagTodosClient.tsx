// components/TodosClient.tsx
"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { useTags } from "@/hooks/useTags";
import { TodoData } from "@/utils/todo.schema";
import { TagData } from "@/utils/tag.schema";
import { DateFilter } from "@/utils/date";
import Todos from "@/components/Todos";
import TodoForm from "@/components/TodoForm";

export default function TodosClient({
  tag,
  initialTodos,
  initialTags,
}: {
  tag: TagData;
  initialTodos: TodoData[];
  initialTags: TagData[];
}) {
  const { todosQuery, updateMutation, addMutation, deleteMutation } = useTodos(
    tag.id
  );
  const { tagsQuery } = useTags();

  const todos = todosQuery.data ?? initialTodos;
  const tags = tagsQuery.data ?? initialTags;

  const [drawer, setDrawer] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  const openDrawer = (filterBy: DateFilter, todoId?: string) => {
    setEditingTodoId(todoId ?? null);
    setDrawer(true);
  };

  const closeDrawer = () => {
    setDrawer(false);
    setEditingTodoId(null);
  };

  return (
    <main className="flex">
      <Todos
        todos={todos}
        tags={tags} // ✅ optional but passed for tag display
        title={tag.name}
        filterBy="all"
        onOpenDrawer={openDrawer}
        editingTodoId={editingTodoId}
      />

      {drawer && (
        <TodoForm
          open={drawer}
          initValues={
            editingTodoId
              ? todos.find((t) => t.id === editingTodoId) ?? null
              : null
          }
          tags={tags} // ✅ needed for dropdowns in the form
          filterBy="today"
          onClose={closeDrawer}
          onSubmit={(data) => {
            if (editingTodoId) {
              updateMutation.mutate({ id: editingTodoId, todo: data });
            } else {
              addMutation.mutate(data);
            }
          }}
          onDelete={(id) =>
            deleteMutation.mutate(id, { onSuccess: () => closeDrawer() })
          }
        />
      )}
    </main>
  );
}
