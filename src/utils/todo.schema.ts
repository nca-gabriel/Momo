import { z } from "zod";
import { tagData } from "./tag.schema";
import { subTodoPatch, subTodoData } from "./subtodo.schema";

export const todoForm = z.object({
  title: z.string().min(1),
  description: z.string().nullish(),
  completed: z.boolean().optional(),
  todoDate: z.coerce.date(),
  subTodos: z.array(subTodoPatch).optional(), // for creating nested subtodos
  tag: z.array(tagData).optional(), // for creating nested tags
});

export const todoData = todoForm.extend({
  id: z.string(),
  createdAt: z.coerce.date(),
  subTodos: z.array(subTodoData), // full subTodo info when fetching/updating
  tag: z.array(tagData), // full tag info when fetching/updating
});

export const TodoDataArr = z.array(todoData);

export const todoPatch = todoForm.partial().extend({
  id: z.string().optional(),
  subTodos: z.array(subTodoPatch).optional(),
});

// Compile time ts
export type TodoForm = z.infer<typeof todoForm>; // for forms / RHF
export type TodoData = z.infer<typeof todoData>; // for API / Prisma
export type TodoPatch = z.infer<typeof todoPatch>; // for partial updates

// runtime (schema) = app running error
// compiletime (type | TS) = red line when coding
// react props === types!!!
