// TodoList.tsx
import TodoForm from "./TodoForm";
import { useTodos } from "../hooks/useTodos";
import { useState } from "react";
import { todoInput } from "@/types/todo.schema";

export default function TodoList() {
  const { todos, addTodo, deleteTodo, updateTodo } = useTodos();
  const [drawer, setDrawer] = useState(false);
  const [editingTodo, setEditingTodo] = useState<todoInput | null>(null);

  return (
    <div className="debug3 flex h-screen">
      <main
        className={`flex-1 p-4 transition-all duration-300 ${drawer ? "" : ""}`}
      >
        <div className="flex justify-end">
          <button
            onClick={() => {
              setDrawer(!drawer);
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
              className="border p-2 flex justify-between"
              onClick={() => {
                setEditingTodo(todo);
                setDrawer(true);
              }}
            >
              <div>
                <h2 className="font-bold">{todo.title}</h2>
                <small></small>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* drawer */}
      {drawer && (
        <TodoForm
          initialValues={editingTodo}
          onSubmit={(data) => {
            if (editingTodo) {
              updateTodo(editingTodo.id, data);
              setEditingTodo(null);
            } else {
              addTodo(data);
            }
          }}
          onClose={() => {
            setEditingTodo(null);
            setDrawer(false);
          }}
          onDelete={
            editingTodo
              ? () => {
                  deleteTodo(editingTodo.id);
                  setEditingTodo(null);
                  setDrawer(false);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
