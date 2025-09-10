import { z } from "zod";

export const tagSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Invalid hex color"),
  date: z.coerce.date(),
});
export type tagInput = z.infer<typeof tagSchema>;

export type tagState = tagInput[]; // array of  tag
