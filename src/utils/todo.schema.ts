import { z } from "zod";
import { tagData, tagForm } from "./tag.schema";

// runtime (schema) = app running error
// compiletime (type | TS) = red line when coding
// react props === types!!!

export const subTodoForm = z.object({
  title: z.string().min(1),
  done: z.boolean().optional(),
});

export const subTodoData = subTodoForm.extend({
  id: z.string(),
  todoId: z.string(),
  createdAt: z.coerce.date(),
});

export const todoForm = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  completed: z.boolean().optional(),
  todoDate: z.coerce.date(),
  subTodos: z.array(subTodoForm).optional(), // for creating nested subtodos
  tag: z.array(tagForm).optional(), // for creating nested tags
});

export const todoData = todoForm.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  subTodos: z.array(subTodoData), // full subTodo info when fetching/updating
  tag: z.array(tagData), // full tag info when fetching/updating
});

// Array for validation
export const TodoDataArr = z.array(todoData);

// Compile time ts
export type SubTodoForm = z.infer<typeof subTodoForm>;
export type SubTodoData = z.infer<typeof subTodoData>;
export type TodoForm = z.infer<typeof todoForm>; // for forms / RHF
export type TodoData = z.infer<typeof todoData>; // for API / Prisma

export const todoPatch = todoData.partial();
export type TodoPatch = z.infer<typeof todoPatch>; // for partial updates
