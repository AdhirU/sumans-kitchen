import { z } from "zod";

export const newRecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  ingredients: z.array(z.string()),
  directions: z.array(z.string()),
});
