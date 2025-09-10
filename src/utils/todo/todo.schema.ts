import { z } from "zod";

export const subTodoSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  title: z.string().min(1, "title is required"),
  details: z.string().default(""),
  status: z.boolean().default(false),
});
export type subTodoInput = z.infer<typeof subTodoSchema>;

export const todoSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  title: z.string().min(1, "title is required"),
  details: z.string().default(""),
  date: z.coerce.date(),
  status: z.boolean().default(false),
  tagId: z.uuid().default("00000000-0000-0000-0000-000000000000"),
  subTodos: z.array(subTodoSchema).default([]),
});
export type todoInput = z.infer<typeof todoSchema>; // single object

export type TodoState = todoInput[]; // array of  todos
