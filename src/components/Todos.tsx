"use client";

import { useState } from "react";
import { TodoData } from "@/utils/todo.schema";
import { TagData } from "@/utils/tag.schema";
import TodoForm from "./TodoForm";
import Image from "next/image";
import { useTodos, useTodo } from "@/hooks/useTodos";
import { isToday, isThisWeek, isTomorrow } from "@/utils/date";

type DateFilter = "today" | "tomorrow" | "thisWeek";

type Props = {
  todos: TodoData[];
  tags: TagData[];
  filterBy: DateFilter;
};

export default function Todos({ todos, tags, filterBy }: Props) {
  const [drawer, setDrawer] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  // fetch single todo when editing
  const { data: editingTodo } = useTodo(editingTodoId ?? "");

  const { addMutation, updateMutation, deleteMutation } = useTodos();

  const filterTodos = () => {
    switch (filterBy) {
      case "today":
        return todos.filter((t) => t.todoDate && isToday(t.todoDate));
      case "tomorrow":
        return todos.filter((t) => t.todoDate && isTomorrow(t.todoDate));
      case "thisWeek":
        return todos.filter((t) => t.todoDate && isThisWeek(t.todoDate));
      default:
        return todos;
    }
  };

  const filteredTodos = filterTodos();

  return (
    <main className="debug3 flex flex-1">
      <div className="flex-1">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setDrawer(true);
              setEditingTodoId(null);
            }}
            className="flex items-center gap-1 text-gray-700 text-sm font-medium hover:text-violet-600 transition-colors cursor-pointer"
          >
            <span className="text-lg">+</span>
            <span>Add</span>
          </button>
        </div>

        <ul className="gap-2">
          {filteredTodos.length === 0 ? (
            <li className="p-2 text-gray-500">No tasks yet</li>
          ) : (
            filteredTodos.map((todo) => {
              const todoTags = tags.filter((l) => l.todoId === todo.id);

              return (
                <li
                  key={todo.id}
                  className={`border-b border-gray-200 p-2 cursor-pointer ${
                    todo.completed ? "opacity-50" : ""
                  }`}
                  onClick={() => {
                    setEditingTodoId(todo.id);
                    setDrawer(true);
                  }}
                >
                  {/* rows */}
                  <section className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-violet-600"
                        checked={todo.completed || false}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateMutation.mutate({
                            id: todo.id,
                            todo: { completed: e.target.checked },
                          })
                        }
                      />
                      <h2
                        className={`font-bold ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTodoId(todo.id);
                        setDrawer(true);
                      }}
                    >
                      <Image
                        src="/arrow.png"
                        alt="arrow"
                        width={15}
                        height={15}
                      />
                    </button>
                  </section>

                  <section className="flex flex-wrap gap-5 ml-5">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/calendar.png"
                        alt="calendar"
                        width={18}
                        height={18}
                      />
                      {new Date(todo.todoDate).toLocaleDateString("en-GB", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                      })}
                    </div>

                    {todo.subTodos?.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 text-center w-5 font-light rounded">
                          {todo.subTodos.length}
                        </span>
                        <span>Subtask</span>
                      </div>
                    )}

                    {todoTags.map((tag) => (
                      <div key={tag.id} className="flex items-center gap-2">
                        <span
                          className="inline-block w-5 h-5 rounded-sm"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>{tag.name}</span>
                      </div>
                    ))}
                  </section>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* drawer */}
      {drawer && (
        <TodoForm
          open={drawer}
          initValues={editingTodo ?? null}
          tags={tags}
          onClose={() => {
            setEditingTodoId(null);
            setDrawer(false);
          }}
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
                setEditingTodoId(null);
              },
            });
          }}
        />
      )}
    </main>
  );
}
