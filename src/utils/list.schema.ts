import { z } from "zod";

export const listSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  name: z.string(),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Invalid hex color"),
  date: z.coerce.date(),
});
export type listInput = z.infer<typeof listSchema>;

export type ListState = listInput[]; // array of  tag
