import { z } from "zod";

export const noteSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().default(""),
  color: z.string().default(""),
  date: z.coerce.date(),
});

export type noteInput = z.infer<typeof noteSchema>;

export type noteState = noteInput[];
