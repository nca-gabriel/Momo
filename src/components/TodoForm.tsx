"use client";

import { useState } from "react";
import { Todo, TodoArr } from "@/utils/todo.schema";
import { TagArr } from "@/utils/tag.schema";
import { useTodos } from "@/hooks/useTodos";

type Props = {
  open: boolean;
  initialValues: Todo | null;
  tags: TagArr;
  onClose: () => void;
  onSubmit: (data: Partial<Todo>) => void;
  onDelete?: (id: string) => void;
};

export default function TodoForm({
  open,
  initialValues,
  tags,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [completed, setCompleted] = useState(initialValues?.completed || false);
  const [todoDate, setTodoDate] = useState(
    initialValues?.todoDate
      ? new Date(initialValues.todoDate).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [tagId, setTagId] = useState(initialValues?.tag?.[0]?.id || "");
  const [subTodos, setSubTodos] = useState(initialValues?.subTodos || []);

  const handleAddSubTodo = () =>
    setSubTodos([...subTodos, { title: "", done: false }]);
  const handleSubTodoChange = (index: number, value: string) => {
    const newSubs = [...subTodos];
    newSubs[index].title = value;
    setSubTodos(newSubs);
  };
  const handleRemoveSubTodo = (index: number) => {
    const newSubs = [...subTodos];
    newSubs.splice(index, 1);
    setSubTodos(newSubs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      completed,
      todoDate: new Date(todoDate),
      subTodos,
      tag: tagId ? tags.filter((t) => t.id === tagId) : [],
    });
    if (!initialValues) {
      // reset form after new todo
      setTitle("");
      setDescription("");
      setCompleted(false);
      setTodoDate(new Date().toISOString().slice(0, 16));
      setTagId("");
      setSubTodos([]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 right-0 bottom-0 w-72 p-4 bg-gray-50 shadow-lg border z-10 overflow-y-auto">
      <header className="flex justify-between mb-4">
        <h2 className="font-bold">Task</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-violet-600"
        >
          ✕
        </button>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Name"
          className="border p-2 rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Details"
          className="border p-2 rounded"
        />
        <input
          type="datetime-local"
          value={todoDate}
          onChange={(e) => setTodoDate(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={tagId}
          onChange={(e) => setTagId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Notag">No tag</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <h3 className="font-semibold">Subtasks:</h3>
        {subTodos.map((sub, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={sub.title}
              onChange={(e) => handleSubTodoChange(index, e.target.value)}
              className="border p-1 rounded flex-1"
              placeholder="Subtask title"
            />
            <button
              type="button"
              onClick={() => handleRemoveSubTodo(index)}
              className="text-red-500 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSubTodo}
          className="text-gray-700 hover:text-gray-900"
        >
          + Add Subtask
        </button>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-violet-600 text-white px-4 py-1 rounded flex-1 hover:bg-violet-800"
          >
            {initialValues ? "Update" : "Add"}
          </button>
          {initialValues && onDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete(initialValues.id);
                onClose();
              }}
              className="bg-gray-300 text-gray-500 px-4 py-1 rounded flex-1 hover:bg-gray-600 hover:text-white"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
