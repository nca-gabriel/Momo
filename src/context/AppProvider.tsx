"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useTodos } from "@/hooks/useTodos";
import { useTags } from "@/hooks/useTags";
import { useNotes } from "@/hooks/useNotes";

type TodoContextType = ReturnType<typeof useTodos>;
type TagContextType = ReturnType<typeof useTags>;
type NoteContextType = ReturnType<typeof useNotes>;

const TodoContext = createContext<TodoContextType | null>(null);
const TagContext = createContext<TagContextType | null>(null);
const NoteContext = createContext<NoteContextType | null>(null);

export default function AppProvider({ children }: { children: ReactNode }) {
  const todos = useTodos();
  const tags = useTags();
  const notes = useNotes();

  return (
    <TodoContext.Provider value={todos}>
      <TagContext.Provider value={tags}>
        <NoteContext.Provider value={notes}>{children}</NoteContext.Provider>
      </TagContext.Provider>
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

export function useNoteContext() {
  const ctx = useContext(NoteContext);
  if (!ctx) throw new Error("useNoteContext must be used within AppProvider");
  return ctx;
}
