import { z } from "zod";

export const tagSchema = z.object({
  name: z.string(),
  color: z.string(),
  date: z.coerce.date(),
});
export type tagInput = z.infer<typeof tagSchema>;
