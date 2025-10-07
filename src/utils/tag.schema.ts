import { z } from "zod";

export const tagForm = z.object({
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
});

export const tagData = tagForm.extend({
  id: z.string(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
});

// Array for validation
export const TagArr = z.array(tagData);

export const tagPatch = tagData.partial().extend({
  color: z.string().min(1, "Color is required").optional(),
});

export type TagPatch = z.infer<typeof tagPatch>;

export type TagForm = z.infer<typeof tagForm>; // for forms / RHF
export type TagData = z.infer<typeof tagData>; // for API / Prisma responses
