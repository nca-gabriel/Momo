"use client";
import React, { useState, useEffect } from "react";
import { useTagContext, useTodoContext } from "@/context/AppProvider";
import Image from "next/image";
import TodoForm from "../../components/TodoForm";
import { todoInput } from "@/utils/todo/todo.schema";

export default function Upcoming() {
  const { todos, addTodo, updateTodo, deleteTodo } = useTodoContext();
  const { tags } = useTagContext();

  const [drawer, setDrawer] = useState(false);
  const [editingTodo, setEditingTodo] = useState<todoInput | null>(null);

  // ✅ freeze dates once, avoid hydration mismatch
  const [today] = useState(() => new Date());
  const [tomorrow] = useState(() => {
    const t = new Date();
    t.setDate(today.getDate() + 1);
    return t;
  });
  const [endOfWeek] = useState(() => {
    const e = new Date();
    e.setDate(today.getDate() + 7);
    return e;
  });

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const todayTodos = todos.filter((t) => isSameDay(new Date(t.date), today));
  const tomorrowTodos = todos.filter((t) =>
    isSameDay(new Date(t.date), tomorrow)
  );
  const thisWeekTodos = todos.filter((t) => {
    const todoDate = new Date(t.date);
    return todoDate > tomorrow && todoDate <= endOfWeek;
  });

  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;
  const rendertag = (title: string, tag: typeof todos) => (
    <div className="flex flex-col flex-1 min-h-full w-full">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <ul className="gap-2">
        {tag.length === 0 ? (
          <li className="p-2 text-gray-500">No tasks</li>
        ) : (
          tag.map((todo) => {
            const tagData = tags.find((l) => l.id === todo.tagId);
            return (
              <li
                key={todo.id}
                className={`border-b border-gray-200 p-2 cursor-pointer ${
                  todo.status ? "opacity-50" : ""
                }`}
                onClick={() => {
                  setEditingTodo(todo);
                  setDrawer(true);
                }}
              >
                <div className="flex justify-between mb-2">
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
                      onClick={(e) => e.stopPropagation()}
                    />
                    <h3
                      className={`font-bold ${
                        todo.status ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {todo.title}
                    </h3>
                  </div>
                  <button>
                    <Image
                      src="/arrow.png"
                      alt="arrow"
                      width={15}
                      height={15}
                    />
                  </button>
                </div>
                <div className="flex flex-wrap gap-5 ml-5 mt-1 text-sm">
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
                      <span className="bg-gray-100 text-center w-5 rounded">
                        {todo.subTodos.length}
                      </span>
                      <span>Subtasks</span>
                    </div>
                  )}
                  {tagData && (
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-4 h-4 rounded-sm"
                        style={{ backgroundColor: tagData.color }}
                      />
                      <span>{tagData.name}</span>
                    </div>
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );

  return (
    <main className="flex w-full min-h-full p-4">
      <div className="flex flex-col flex-1 min-h-full">
        <header className="mb-6">
          <h1 className="text-4xl font-semibold">Upcoming</h1>
        </header>

        <div className="mb-6 border border-gray-200 p-2 rounded">
          {rendertag("Today", todayTodos)}
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex-1 border border-gray-200 p-2 rounded">
            {rendertag("Tomorrow", tomorrowTodos)}
          </div>
          <div className="flex-1 border border-gray-200 p-2 rounded">
            {rendertag("This Week", thisWeekTodos)}
          </div>
        </div>
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
              addTodo(data);
            }
          }}
          onDelete={(id) => {
            deleteTodo(id);
          }}
        />
      )}
    </main>
  );
}
