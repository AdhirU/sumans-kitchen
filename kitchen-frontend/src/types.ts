export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  directions: string[];
}

export type NewRecipe = Omit<Recipe, "id">;
