import { z } from "zod";

export const subTodoSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  title: z.string().min(1, "title is required"),
  details: z.string().optional(),
  date: z.date().default(() => new Date()),
});
export type subTodoInput = z.infer<typeof subTodoSchema>;

export const todoSchema = z.object({
  id: z.uuid().default(() => crypto.randomUUID()),
  title: z.string().min(1, "title is required"),
  details: z.string().optional(),
  date: z.date().default(() => new Date()),
  subTodos: z.array(subTodoSchema).default([]),
});
export type todoInput = z.infer<typeof todoSchema>; // single object

export type TodoState = todoInput[]; // array of  todos
