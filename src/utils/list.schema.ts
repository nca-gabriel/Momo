import { z } from "zod";

export const listSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  name: z.string(),
  date: z.coerce.date(),
});
export type listInput = z.infer<typeof listSchema>;

export type ListState = listInput[]; // array of  tag
