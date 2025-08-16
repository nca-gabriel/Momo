// TodoList.tsx
import TodoForm from "./TodoForm";
import useTodos from "../hooks/useTodos";
import { useState } from "react";

export default function TodoList() {
  const [drawer, setDrawer] = useState(false);
  const { todos, deleteTodo } = useTodos();

  return (
    <div className="debug3 flex h-screen">
      {/* main content */}
      <main
        className={`flex-1 p-4 transition-all duration-300 ${drawer ? "" : ""}`}
      >
        <div className="flex justify-end">
          <button onClick={() => setDrawer(!drawer)}>add</button>
        </div>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="border p-2 flex justify-between">
              <div>
                <h2 className="font-bold">{todo.title}</h2>
                <small>{todo.tags}</small>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-red-500 px-2 text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* drawer */}
      {drawer && <TodoForm />}
    </div>
  );
}
