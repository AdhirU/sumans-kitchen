export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  directions: string[];
  is_public: boolean;
  user_id: string;
  image_url?: string;
}

export type NewRecipe = Omit<Recipe, "id" | "user_id">;
