"use client";

import { useState } from "react";
import { useTodos, useTodo } from "@/hooks/useTodos";
import { useTags } from "@/hooks/useTags";
import { TodoData } from "@/utils/todo.schema";
import { TagData } from "@/utils/tag.schema";
import { DateFilter } from "@/utils/date";
import Todos from "@/components/Todos";
import TodoForm from "@/components/TodoForm";

type Props = {
  initialTodos: TodoData[];
  initialTags: TagData[];
};

export default function UpcomingClient({ initialTodos, initialTags }: Props) {
  const { todosQuery, addMutation, updateMutation, deleteMutation } =
    useTodos();
  const { tagsQuery } = useTags();

  const todos = todosQuery.data ?? initialTodos;
  const tags = tagsQuery.data ?? initialTags;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<DateFilter>("today");

  const openDrawer = (filter: DateFilter, todoId?: string) => {
    setCurrentFilter(filter);
    setEditingTodoId(todoId ?? null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setEditingTodoId(null);
    setDrawerOpen(false);
  };

  const editingTodo = useTodo(editingTodoId ?? "").data;

  return (
    <div className="flex relative">
      <main className="flex flex-col flex-1 gap-6 p-2">
        <header className="mb-6">
          <h1 className="text-4xl font-semibold">Upcoming</h1>
        </header>

        {/* Today */}
        <section className="border border-gray-200 p-3 rounded">
          <Todos
            todos={todos}
            tags={tags}
            filterBy="today"
            title="Today"
            editingTodoId={editingTodoId}
            onOpenDrawer={openDrawer}
          />
        </section>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Tomorrow */}
          <section className="flex-1 border border-gray-200 p-3 rounded">
            <Todos
              todos={todos}
              tags={tags}
              filterBy="tomorrow"
              title="Tomorrow"
              editingTodoId={editingTodoId}
              onOpenDrawer={openDrawer}
            />
          </section>

          {/* This Week */}
          <section className="flex-1 border border-gray-200 p-3 rounded">
            <Todos
              todos={todos}
              tags={tags}
              filterBy="thisWeek"
              title="This Week"
              editingTodoId={editingTodoId}
              onOpenDrawer={openDrawer}
            />
          </section>
        </div>

        {/* Drawer */}
      </main>
      {drawerOpen && (
        <div className="flex-none">
          <TodoForm
            open={drawerOpen}
            initValues={editingTodo ?? null}
            tags={tags}
            filterBy={currentFilter}
            onClose={closeDrawer}
            onSubmit={(data) => {
              if (editingTodo) {
                updateMutation.mutate({ id: editingTodo.id, todo: data });
              } else {
                addMutation.mutate(data);
              }
            }}
            onDelete={(id) => {
              deleteMutation.mutate(id, {
                onSuccess: () => {
                  closeDrawer();
                },
              });
            }}
          />
        </div>
      )}
    </div>
  );
}
