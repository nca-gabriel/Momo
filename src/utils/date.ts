import { TodoData } from "@/utils/todo.schema";

// utils/date.ts
export function isToday(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function isTomorrow(date: string | Date) {
  const d = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  );
}

function isThisWeek(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return d >= startOfWeek && d <= endOfWeek;
}

export type DateFilter = "today" | "tomorrow" | "thisWeek" | "upcoming";

export const filterTodos = (filterBy: DateFilter, todos: TodoData[]) => {
  let filtered: TodoData[];

  switch (filterBy) {
    case "today":
      filtered = todos.filter((t) => t.todoDate && isToday(t.todoDate));
      break;
    case "tomorrow":
      filtered = todos.filter((t) => t.todoDate && isTomorrow(t.todoDate));
      break;
    case "thisWeek":
      filtered = todos.filter((t) => t.todoDate && isThisWeek(t.todoDate));
      break;
    default:
      filtered = todos;
  }

  // sort by closest upcoming time
  const now = new Date();
  return filtered.sort((a, b) => {
    if (!a.todoDate || !b.todoDate) return 0;
    const diffA = new Date(a.todoDate).getTime() - now.getTime();
    const diffB = new Date(b.todoDate).getTime() - now.getTime();
    return diffA - diffB;
  });
};

export function getDefaultDate(filter: DateFilter): Date {
  const now = new Date();
  if (filter === "today") return now;
  if (filter === "tomorrow") {
    const t = new Date();
    t.setDate(now.getDate() + 1);
    return t;
  }
  if (filter === "thisWeek") {
    const t = new Date();
    t.setDate(now.getDate() + 3); // arbitrary mid-week default
    return t;
  }
  return now;
}
