import { DateFilter, isToday } from "./date";

const now = new Date();
export const localISOTime = new Date(
  now.getTime() - now.getTimezoneOffset() * 60000
)
  .toISOString()
  .slice(0, 16);

export const toLocalDatetimeInput = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

export function formatTodoDate(date: Date, filterBy?: DateFilter) {
  if (filterBy === "today" && isToday(date)) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
