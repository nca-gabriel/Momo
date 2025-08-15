"use client";
import { FormEvent, useState } from "react";

interface TodoFormProps {
  addTodo: (title: string) => void;
}

export default function TodoForm({ addTodo }: TodoFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTodo(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a todo"
        className="border px-2 py-1 flex-1"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Add
      </button>
    </form>
  );
}
