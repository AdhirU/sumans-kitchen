import { z } from "zod";

export const recipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  directions: z.array(z.string()),
});

export const newRecipeSchema = recipeSchema.omit({ id: true });

export type IRecipe = z.infer<typeof recipeSchema>;
export type INewRecipe = z.infer<typeof newRecipeSchema>;
