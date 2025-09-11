"use client";

import React, { useState, useEffect } from "react";
import { useNoteContext } from "@/context/AppProvider";
import { noteInput, noteSchema } from "@/utils/note/note.schema";

export default function Page() {
  const { notes, addNote, updateNote, deleteNote } = useNoteContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // map of note id -> description textarea
  const descRefs: Record<string, HTMLTextAreaElement | null> = {};

  useEffect(() => setReady(true), []);
  if (!ready) return null;

  const handleAdd = () => {
    const newNote = noteSchema.parse({
      id: crypto.randomUUID(),
      name: "",
      description: "",
      date: new Date(),
    });
    addNote(newNote);
    setEditingId(newNote.id);
  };

  const handleBlur = (note: noteInput) => {
    updateNote(note.id, note);
    setEditingId(null);
  };

  return (
    <main className="flex w-full min-h-full p-4 flex-col gap-10">
      <header>
        <h1 className="text-4xl font-semibold">Sticky Notes!</h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {notes.map((note) => {
          const isEditing = editingId === note.id;

          return (
            <div
              key={note.id}
              className="p-4 rounded-lg shadow-md relative"
              style={{ backgroundColor: note.color, minHeight: "100px" }}
              onClick={() => setEditingId(note.id)}
            >
              {/* Title (single-line) */}
              <textarea
                value={note.name}
                onChange={(e) => {
                  note.name = e.target.value;
                  updateNote(note.id, note);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    descRefs[note.id]?.focus();
                  }
                }}
                onBlur={() => handleBlur(note)}
                rows={1}
                className="w-full bg-transparent resize-none border-none outline-none font-bold p-0 text-3xl"
                autoFocus={isEditing}
              />

              {/* Description (multiline allowed) */}
              <textarea
                ref={(el: HTMLTextAreaElement | null) => {
                  descRefs[note.id] = el;
                }}
                value={note.description}
                onChange={(e) => {
                  note.description = e.target.value;
                  updateNote(note.id, note);
                }}
                onBlur={() => handleBlur(note)}
                rows={4}
                className="w-full bg-transparent resize-none border-none outline-none p-0 mt-1"
              />

              {/* Delete button */}
              {isEditing && (
                <div className="absolute top-2 right-4">
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                      setEditingId(null);
                    }}
                    className="text-red-600 font-bolder text-lg"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add note button */}
        <button
          onClick={handleAdd}
          className="flex items-center justify-center w-full h-40 text-6xl bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          +
        </button>
      </section>
    </main>
  );
}
