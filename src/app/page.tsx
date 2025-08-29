"use client";

import TodoForm from "../components/TodoForm";
import { useTodoContext } from "@/context/AppContext";
import { useState } from "react";
import { todoInput } from "@/utils/todo.schema";

export default function Home() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoContext();
  const [drawer, setDrawer] = useState(false);
  const [editingTodo, setEditingTodo] = useState<todoInput | null>(null);

  return (
    <div className="flex flex-1 debug2">
      <main className="ml-4 pl-5 py-5 flex flex-1 flex-col">
        <h1 className="text-4xl font-semibold">Today!</h1>

        <div className="debug3 flex h-screen">
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
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="border p-2 flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
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
                </li>
              ))}
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
