"use client";
import TodoList from "@/components/TodoList";
import TodoForm from "../components/TodoForm";
import useTodos from "../hooks/useTodos";
import { useState } from "react";

export default function Home() {
  return (
    <div className="flex flex-1 debug2">
      <main className="ml-4 pl-5 py-5 flex flex-1 flex-col">
        <h1 className="text-4xl font-semibold">Today!</h1>

        <TodoList />
      </main>
    </div>
  );
}
