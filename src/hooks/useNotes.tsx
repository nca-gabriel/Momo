import { useEffect, useReducer } from "react";
import { noteReducer } from "@/utils/note/note.reducer";
import { noteInput, noteSchema } from "@/utils/note/note.schema";

const STORAGE_KEY = "notes";

function initNotes(): noteInput[] {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY);
    let notes: noteInput[] = raw ? JSON.parse(raw) : [];

    if (notes.length === 0) {
      const defaultNote: noteInput = {
        id: crypto.randomUUID(),
        name: "Welcome to Notes",
        description:
          "This is your first sticky note. You can edit or delete me.",
        color: stickyColors[0], // yellow
        date: new Date(),
      };
      notes = [defaultNote];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }

    return notes;
  }
  return [];
}

const stickyColors = ["#fef9c3", "#fca5a5", "#a7f3d0", "#bfdbfe", "#fbcfe8"];
// yellow, red, green, blue, pink

export function useNotes() {
  const [notes, dispatch] = useReducer(noteReducer, [], initNotes);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = (note: Partial<noteInput>) => {
    const parsed = noteSchema.parse({
      ...note,
      id: note.id || crypto.randomUUID(),
      color: stickyColors[Math.floor(Math.random() * stickyColors.length)],
      date: note.date || new Date(),
    });
    dispatch({ type: "ADD_NOTE", payload: parsed });
  };

  const updateNote = (id: string, data: noteInput) => {
    dispatch({ type: "UPDATE_NOTE", payload: { id, data } });
  };

  const deleteNote = (id: string) => {
    dispatch({ type: "DELETE_NOTE", payload: { id } });
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
  };
}
