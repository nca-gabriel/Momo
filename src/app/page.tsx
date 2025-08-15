"use client";
import Sidebar from "@/components/sidebar/Sidebar";
import TodoForm from "@/components/todoRef/TodoForm";
import TodoList from "@/components/todoRef/TodoList";
import { useTodos } from "@/components/todoRef/useTodos";

export default function Home() {
  const { todos, addTodo, updateTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
      <Sidebar />
      <main className="mx-4 p-5 flex flex-1 flex-col">
        <h1 className="text-4xl font-semibold">Today!</h1>
        <TodoForm addTodo={addTodo} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />
      </main>
    </div>
  );
}
