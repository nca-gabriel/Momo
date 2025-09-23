import { z } from "zod";

export const subTodoForm = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  done: z.boolean().optional(),
});

export const subTodoData = subTodoForm.extend({
  id: z.string(),
  todoId: z.string(),
  createdAt: z.coerce.date(),
});

export const subTodoPatch = subTodoForm.extend({
  id: z.string().min(1).optional(),
  todoId: z.string().optional(),
});

export type SubTodoForm = z.infer<typeof subTodoForm>;
export type SubTodoData = z.infer<typeof subTodoData>;
export type SubTodoPatch = z.infer<typeof subTodoPatch>;
