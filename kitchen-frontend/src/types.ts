export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string | null;
  ingredients: string[];
  directions: string[];
}

export type NewRecipe = Omit<Recipe, "id">;
