"use client";

import TodoForm from "@/components/TodoForm";
import { useListContext, useTodoContext } from "@/context/AppProvider";
import { useState, useEffect } from "react";
import { todoInput } from "@/utils/todo/todo.schema";
import { useParams } from "next/navigation"; // App Router

export default function ListPage() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoContext();
  const { lists } = useListContext();

  const params = useParams(); // { name: string }
  const listName = params.name;

  const list = lists.find((l) => l.name === listName);

  const listTodos = todos.filter((todo) => todo.ListId === list?.id);

  const [drawer, setDrawer] = useState(false);
  const [editingTodo, setEditingTodo] = useState<todoInput | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!list) return <p>List not found</p>;

  return (
    <div className="flex flex-1">
      <main className="ml-4 pl-5 py-5 flex flex-1 flex-col">
        <h1 className="text-4xl font-semibold flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: list.color }}
          />
          {list.name}
        </h1>

        <div className="flex h-screen">
          <main className="flex-1 p-4">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  setDrawer(true);
                  setEditingTodo(null);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>

            <ul className="space-y-2">
              {listTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="border-b-1 p-2 flex flex-col justify-between gap-2"
                >
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={todo.status || false}
                        onChange={(e) =>
                          updateTodo(todo.id, {
                            ...todo,
                            status: e.target.checked,
                          })
                        }
                      />
                      <h2
                        className={`font-bold ${
                          todo.status ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.title}
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTodo(todo);
                        setDrawer(true);
                      }}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex gap-2 mt-1">
                    <span>
                      {new Date(todo.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </span>
                  </div>
                </li>
              ))}

              {listTodos.length === 0 && <li>No todos in this list</li>}
            </ul>
          </main>

          {drawer && (
            <TodoForm
              initialValues={editingTodo}
              onClose={() => {
                setEditingTodo(null);
                setDrawer(false);
              }}
              onSubmit={(data) => {
                if (editingTodo) {
                  updateTodo(editingTodo.id, data);
                } else {
                  addTodo({ ...data, ListId: list.id });
                }
              }}
              onDelete={(id) => {
                deleteTodo(id);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
