"use client";

import TodoForm from "../components/TodoForm";
import { useListContext, useTodoContext } from "@/context/AppProvider";
import { useState, useEffect } from "react";
import { todoInput } from "@/utils/todo/todo.schema";
import Image from "next/image";

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

  const isToday = (date: string | Date) => {
    const today = new Date();
    const d = new Date(date);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  return (
    <main className="">
      <div className=" flex h-screen ">
        <main className="flex-1 mr-4 max-sm:mr-0 ">
          <h1 className="text-4xl font-semibold flex-1  ">Today!</h1>
          <div className="flex justify-end my-3 max-sm:mb-0">
            <button
              onClick={() => {
                setDrawer(true);
                setEditingTodo(null);
              }}
              className="flex items-center gap-1 text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors cursor-pointer"
            >
              <span className="text-lg">+</span>
              <span>Add</span>
            </button>
          </div>
          <ul className="space-y-1">
            {todos.filter((todo) => todo.date && isToday(todo.date)).length ===
            0 ? (
              <li className="p-2 text-gray-500 italic">No tasks yet</li>
            ) : (
              todos
                .filter((todo) => todo.date && isToday(todo.date))
                .map((todo) => {
                  const list = lists.find((l) => l.id === todo.ListId);
                  if (todo.date)
                    return (
                      <li
                        key={todo.id}
                        className={`border-b border-gray-200 p-2 flex flex-col justify-between gap-2 ${
                          todo.status ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
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
                            <Image
                              src="/arrow.png"
                              alt="arrow"
                              width={15}
                              height={15}
                            />
                          </button>
                        </div>
                        <section className="flex gap-5 ml-4">
                          <div className="flex items-center">
                            <span className="flex gap-2">
                              <Image
                                src="/calendar.png"
                                alt="calendar-icon"
                                width={24}
                                height={24}
                              />
                              {new Date(todo.date).toLocaleDateString("en-GB", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "2-digit",
                              })}
                            </span>
                          </div>
                          {todo.subTodos.length > 0 && (
                            <div className="gap-2 flex">
                              <span className="bg-gray-100 px-2 py-0.3 font-light rounded">
                                {todo.subTodos.length}
                              </span>
                              <span>Subtask</span>
                            </div>
                          )}
                          {list && (
                            <div className="flex items-center gap-3">
                              <span
                                className="inline-block w-5 h-5 rounded-sm"
                                style={{ backgroundColor: list.color }}
                              />
                              <span>{list.name}</span>
                            </div>
                          )}
                        </section>
                      </li>
                    );
                })
            )}
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
  );
}
