import { z } from "zod";

export const tagForm = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
});

export const tagData = tagForm.extend({
  id: z.string().optional(),
  todoId: z.string().nullish(), // shorthand for .nullable().optional(),
  createdAt: z.date().optional(),
});

// Array for validation
export const TagArr = z.array(tagData);

export type TagForm = z.infer<typeof tagForm>; // for forms / RHF
export type TagData = z.infer<typeof tagData>; // for API / Prisma responses
