"use client";
import { useState } from "react";
import { Todo } from "@/components/todoRef/useTodos";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  const handleSave = () => {
    if (text.trim()) {
      onUpdate(todo.id, text);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-2 border p-2">
      {isEditing ? (
        <>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border p-1 flex-1"
          />
          <button onClick={handleSave} className="bg-green-500 text-white px-2">
            Save
          </button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span className={todo.completed ? "line-through flex-1" : "flex-1"}>
            {todo.text}
          </span>
          <button onClick={() => setIsEditing(true)} className="text-blue-500">
            Edit
          </button>
          <button onClick={() => onDelete(todo.id)} className="text-red-500">
            Delete
          </button>
        </>
      )}
    </div>
  );
}
