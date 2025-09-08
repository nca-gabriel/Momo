"use client";

import TodoForm from "../components/TodoForm";
import { useListContext, useTodoContext } from "@/context/AppProvider";
import { useState, useEffect } from "react";
import { todoInput } from "@/utils/todo/todo.schema";

export default function Home() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoContext();
  const { lists } = useListContext();

  const [drawer, setDrawer] = useState(false);
  const [editingTodo, setEditingTodo] = useState<todoInput | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    console.log("lists updated", lists);
  }, [lists]);

  if (!ready) return null; // or a loading fallback

  return (
    <div className="flex flex-1">
      <main className="ml-4 pl-5 py-5 flex flex-1 flex-col">
        <h1 className="text-4xl font-semibold">Today!</h1>

        <div className=" flex h-screen">
          <main
            className={`flex-1 p-4 transition-all duration-300 ${
              drawer ? "" : ""
            }`}
          >
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setDrawer(true);
                  setEditingTodo(null);
                }}
              >
                add
              </button>
            </div>
            <ul className="space-y-2">
              {todos.map((todo) => {
                const list = lists.find((l) => l.id === todo.ListId);

                return (
                  <li
                    key={todo.id}
                    className="border-b-1 p-2 flex flex-col justify-between gap-2"
                  >
                    <div className=" flex justify-between">
                      <div className="flex gap-2">
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
                      >
                        Edit
                      </button>
                    </div>
                    <section className="flex gap-2 ml-4">
                      {list && (
                        <div className="flex items-center gap-1">
                          <span
                            className="inline-block w-3 h-3 rounded-full "
                            style={{ backgroundColor: list.color }}
                          />
                          <span>{list.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <span>
                          {new Date(todo.date).toLocaleDateString("en-GB", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                          })}
                        </span>
                      </div>
                    </section>
                  </li>
                );
              })}
            </ul>
          </main>

          {/* drawer */}
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
                  addTodo(data);
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
