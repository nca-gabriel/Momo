import { z } from "zod";

export const noteForm = z.object({
  name: z.string(),
  color: z.string().default(""),
});

export const noteData = noteForm.extend({
  id: z.string().optional(),
  createdAt: z.coerce.date(),
});

export type NoteForm = z.infer<typeof noteForm>;
export type NoteData = z.infer<typeof noteData>;
