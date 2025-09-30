"use client";

import React, { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { NoteData } from "@/utils/note.schema";
import useNotes from "@/hooks/useNotes";

type Props = { initialNotes: NoteData[] };

export default function NoteClient({ initialNotes }: Props) {
  const { notesQuery, addNotes, updateNote, deleteNote } = useNotes();
  const savedNotes = notesQuery.data ?? initialNotes;

  const stickyColors = ["#fef9c3", "#fca5a5", "#a7f3d0", "#bfdbfe", "#fbcfe8"];
  const [editingId, setEditingId] = useState<string | null>(null);
  const descRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const { control, register, setValue } = useForm<{ notes: NoteData[] }>({
    defaultValues: { notes: savedNotes },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "notes",
    keyName: "fieldId",
  });

  // Map for optimistic updates
  const notesRef = useRef<Record<string, NoteData>>(
    Object.fromEntries(savedNotes.map((n) => [n.id!, { ...n }]))
  );

  // Add new local note
  const handleAdd = () => {
    const tempId = crypto.randomUUID(); // temp local ID
    const color = stickyColors[Math.floor(Math.random() * stickyColors.length)];
    const newNote: NoteData = {
      id: tempId,
      name: "",
      description: "",
      color,
      createdAt: new Date(),
    };
    append(newNote);
    notesRef.current[tempId] = { ...newNote };
    setEditingId(tempId);
  };

  // Save or update note
  const handleBlur = (noteId: string) => {
    const note = notesRef.current[noteId];
    if (!note) return;

    const isTemp = noteId.length === 36; // UUID length
    if (isTemp && note.name.trim()) {
      // Add to DB
      addNotes.mutate(
        { name: note.name, description: note.description, color: note.color },
        {
          onSuccess: (savedNote) => {
            const idx = fields.findIndex((f) => f.id === noteId);
            if (idx !== -1) {
              setValue(`notes.${idx}`, savedNote); // update form
              fields[idx] = savedNote; // update field array for UI
            }

            // Replace temp ID with DB _id
            delete notesRef.current[noteId];
            notesRef.current[savedNote.id] = savedNote;
            setEditingId(savedNote.id);
          },
        }
      );
    } else if (!isTemp) {
      // Update existing note
      updateNote.mutate({ id: noteId, note });
    }

    setEditingId(null);
  };

  // Update local note value
  const handleChange = (
    noteId: string,
    field: "name" | "description",
    value: string
  ) => {
    notesRef.current[noteId] = {
      ...notesRef.current[noteId],
      [field]: value,
    };
  };

  // Delete note
  const handleDelete = (note: NoteData, idx: number) => {
    const noteIdToDelete = note.id!;
    remove(idx); // remove from form
    delete notesRef.current[noteIdToDelete];
    deleteNote.mutate(noteIdToDelete); // always delete from DB
    setEditingId(null);
  };

  return (
    <main className="flex w-full min-h-full p-4 flex-col gap-10">
      <header>
        <h1 className="text-4xl font-semibold">Sticky Notes!</h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map((note, idx) => {
          const isEditing = editingId === note.id;

          return (
            <div
              key={note.id}
              className="p-4 rounded-lg shadow-md relative h-60"
              style={{ backgroundColor: note.color, minHeight: "100px" }}
              tabIndex={-1}
              onClick={() => setEditingId(note.id ?? null)}
              onFocus={() => setEditingId(note.id ?? null)}
              onBlur={(e) => {
                if (
                  !e.currentTarget.contains(e.relatedTarget as Node) &&
                  note.id
                ) {
                  handleBlur(note.id);
                }
              }}
            >
              {/* Title */}
              <textarea
                {...register(`notes.${idx}.name`)}
                rows={1}
                className="w-full bg-transparent resize-none border-none outline-none font-bold p-0 text-3xl"
                autoFocus={isEditing}
                onChange={(e) => handleChange(note.id!, "name", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    descRefs.current[note.id!]?.focus();
                  }
                }}
              />

              {/* Description */}
              <textarea
                {...register(`notes.${idx}.description`)}
                rows={4}
                className="w-full bg-transparent resize-none border-none outline-none p-0 mt-1"
                onChange={(e) =>
                  handleChange(note.id!, "description", e.target.value)
                }
              />

              {/* Delete */}
              {isEditing && (
                <div className="absolute top-2 right-4">
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note, idx);
                    }}
                    className="text-red-600 font-bold text-lg"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={handleAdd}
          className="flex items-center justify-center w-full text-6xl h-60 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          +
        </button>
      </section>
    </main>
  );
}
