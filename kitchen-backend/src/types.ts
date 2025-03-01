import { z } from "zod";

export const recipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  directions: z.array(z.string()),
});

export const newRecipeSchema = recipeSchema.omit({ id: true });

export type Recipe = z.infer<typeof recipeSchema>;
export type NewRecipe = z.infer<typeof newRecipeSchema>;
