"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { useTags } from "@/hooks/useTags"; // your hook
import { TodoData } from "@/utils/todo.schema";
import { TagData } from "@/utils/tag.schema";
import Todos from "@/components/Todos";
import TodoForm from "@/components/TodoForm";
import { DateFilter } from "@/utils/date";

export default function TodosClient({
  initialTodos,
  initialTags,
}: {
  initialTodos: TodoData[];
  initialTags: TagData[];
}) {
  const { todosQuery, updateMutation, addMutation, deleteMutation } =
    useTodos();
  const { tagsQuery } = useTags();

  const todos = todosQuery.data ?? initialTodos;
  const tags = tagsQuery.data ?? initialTags;

  // ---------------------------
  // LIFTED STATE FOR DRAWER
  // ---------------------------
  const [drawer, setDrawer] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const openDrawer = (filter: string, todoId?: string) => {
    setActiveFilter(filter);
    setEditingTodoId(todoId ?? null);
    setDrawer(true);
  };

  const closeDrawer = () => {
    setDrawer(false);
    setEditingTodoId(null);
    setActiveFilter(null);
  };

  return (
    <main className="flex">
      <Todos
        todos={todos}
        tags={tags}
        filterBy="today"
        title="Today!"
        onOpenDrawer={openDrawer} // pass the lifted handler
        editingTodoId={editingTodoId}
      />

      {/* Drawers stay global */}
      {drawer && (
        <TodoForm
          open={drawer}
          initValues={
            editingTodoId
              ? todos.find((t) => t.id === editingTodoId) ?? null
              : null
          }
          tags={tags}
          filterBy="today"
          onClose={closeDrawer}
          onSubmit={(data) => {
            if (editingTodoId) {
              updateMutation.mutate({
                id: editingTodoId,
                todo: data,
              });
            } else {
              addMutation.mutate(data);
            }
          }}
          onDelete={(id) => {
            deleteMutation.mutate(id, {
              onSuccess: () => closeDrawer(),
            });
          }}
        />
      )}
    </main>
  );
}
