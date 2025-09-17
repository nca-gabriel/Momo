import { z } from "zod";

export const subTodoSchema = z.object({
  title: z.string().min(1, "title is required"),
  done: z.boolean().default(false),
});
export type subTodoInput = z.infer<typeof subTodoSchema>;

export const todoSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional().nullable(),
  completed: z.boolean().default(false),
  todoDate: z.coerce.date(),
});
// runtime validation schema
export type todoInput = z.infer<typeof todoSchema>; // type for TS only
export const todoArrSchema = z.array<typeof todoSchema>;
