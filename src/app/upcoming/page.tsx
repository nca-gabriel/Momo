"use client";
import React from "react";
import { useTodos } from "@/hooks/useTodos";

export default function Upcoming() {
  const { todos } = useTodos();

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const endOfWeek = new Date();
  endOfWeek.setDate(today.getDate() + 7);

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

  const renderList = (title: string, list: typeof todos) => (
    <div className="mb-6">
      <h2 className="font-bold text-lg mb-2">{title}</h2>
      {list.length > 0 ? (
        <ul className="list-disc pl-5">
          {list.map((todo) => (
            <li key={todo.id} className="mb-1">
              {todo.title} - {new Date(todo.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No tasks</p>
      )}
    </div>
  );

  return (
    <div className="p-4">
      {renderList("Today", todayTodos)}
      {renderList("Tomorrow", tomorrowTodos)}
      {renderList("This Week", thisWeekTodos)}
    </div>
  );
}
