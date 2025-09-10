"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useTodos } from "@/hooks/useTodos";
import { useTags } from "@/hooks/useTags";

type TodoContextType = ReturnType<typeof useTodos>;
type TagContextType = ReturnType<typeof useTags>;

const TodoContext = createContext<TodoContextType | null>(null);
const TagContext = createContext<TagContextType | null>(null);

export default function AppProvider({ children }: { children: ReactNode }) {
  const todos = useTodos();
  const tags = useTags();

  return (
    <TodoContext.Provider value={todos}>
      <TagContext.Provider value={tags}>{children}</TagContext.Provider>
    </TodoContext.Provider>
  );
}

// hooks for consumers
export function useTodoContext() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodoContext must be used within AppProvider");
  return ctx;
}

export function useTagContext() {
  const ctx = useContext(TagContext);
  if (!ctx) throw new Error("usetagContext must be used within AppProvider");
  return ctx;
}
