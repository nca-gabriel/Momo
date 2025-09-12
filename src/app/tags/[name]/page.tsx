"use client";

import TodoForm from "@/components/TodoForm";
import { useTagContext, useTodoContext } from "@/context/AppProvider";
import { useState, useEffect } from "react";
import { todoInput } from "@/utils/todo/todo.schema";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function TagPage() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoContext();
  const { tags } = useTagContext();

  const params = useParams();
  const tagName = params.name;
  const tag = tags.find((l) => l.name === tagName);
  const tagTodos = todos.filter((todo) => todo.tagId === tag?.id);

  const [drawer, setDrawer] = useState(false);
  const [editingTodo, setEditingTodo] = useState<todoInput | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  if (!ready) return null;
  if (!tag) return <p>tag not found</p>;

  return (
    <main className="flex w-full min-h-full p-4">
      <div className="flex flex-col flex-1 min-h-full">
        <header className="">
          <h1 className="text-4xl font-semibold flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-sm"
              style={{ backgroundColor: tag.color }}
            />
            {tag.name}
          </h1>
          <div className="flex justify-end">
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
        </header>

        <ul className="space-y-2">
          {tagTodos.length === 0 ? (
            <li className="p-2 text-gray-500">No tasks yet</li>
          ) : (
            tagTodos.map((todo) => (
              <li
                key={todo.id}
                className={`border-b border-gray-200 p-1.5  cursor-pointer ${
                  todo.status ? "opacity-50" : ""
                }`}
                onClick={() => {
                  setEditingTodo(todo);
                  setDrawer(true);
                }}
              >
                <section className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-violet-600"
                      checked={todo.status || false}
                      onClick={(e) => e.stopPropagation()}
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
                    className="cursor-pointer"
                  >
                    <Image
                      src="/arrow.png"
                      alt="arrow"
                      width={15}
                      height={15}
                    />
                  </button>
                </section>
                <section className=" flex flex-wrap gap-5 ml-5">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/calendar.png"
                      alt="calendar"
                      width={18}
                      height={18}
                    />
                    {new Date(todo.date).toLocaleDateString("en-GB", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    })}
                  </div>
                  {todo.subTodos.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-center w-5 font-light rounded">
                        {todo.subTodos.length}
                      </span>
                      <span>Subtask</span>
                    </div>
                  )}
                </section>
              </li>
            ))
          )}
        </ul>
      </div>

      {drawer && (
        <TodoForm
          open={drawer}
          initialValues={editingTodo}
          onClose={() => {
            setEditingTodo(null);
            setDrawer(false);
          }}
          onSubmit={(data) => {
            if (editingTodo) {
              updateTodo(editingTodo.id, data);
            } else {
              addTodo({ ...data, tagId: tag.id });
            }
          }}
          onDelete={(id) => deleteTodo(id)}
        />
      )}
    </main>
  );
}
