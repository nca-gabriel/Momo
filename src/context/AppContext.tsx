"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useTodos } from "@/hooks/useTodos";
import { useLists } from "@/hooks/useLists";

type TodoContextType = ReturnType<typeof useTodos>;
type ListContextType = ReturnType<typeof useLists>;

const TodoContext = createContext<TodoContextType | null>(null);
const ListContext = createContext<ListContextType | null>(null);

export default function AppContext({ children }: { children: ReactNode }) {
  const todos = useTodos();
  const lists = useLists();

  return (
    <TodoContext.Provider value={todos}>
      <ListContext.Provider value={lists}>{children}</ListContext.Provider>
    </TodoContext.Provider>
  );
}

// hooks for consumers
export function useTodoContext() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodoContext must be used within AppProvider");
  return ctx;
}

export function useListContext() {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error("useListContext must be used within AppProvider");
  return ctx;
}
