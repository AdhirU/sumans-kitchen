import { z } from "zod";

export const newRecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  directions: z.array(z.string()),
});
