import { z } from "zod";

export const noteForm = z.object({
  name: z.string(),
  description: z.string().optional(),
  color: z.string().default(""),
});

export const noteData = noteForm.extend({
  id: z.string().optional(),
  createdAt: z.coerce.date(),
});

export const NoteArr = z.array(noteData);

export const notePatch = noteData.partial().extend({
  name: z.string().min(1, "Name is required").optional(),
  color: z.string().min(1, "Color is required").optional(),
});

export type NoteForm = z.infer<typeof noteForm>;
export type NoteData = z.infer<typeof noteData>;
export type NotePatch = z.infer<typeof notePatch>;
