import { v1 as uuid } from "uuid";

import recipes from "../../data/recipes";
import { NewRecipe, Recipe } from "../types";

const getAll = (): Recipe[] => {
  return recipes;
};

const findById = (id: string): Recipe | undefined => {
  const recipe = recipes.find((r) => r.id === id);
  return recipe;
};

const addRecipe = (recipe: NewRecipe) => {
  const addedRecipe = {
    id: uuid(),
    ...recipe,
  };
  recipes.push(addedRecipe);
  return addedRecipe;
};

const deleteById = (id: string) => {
  recipes.filter((r) => r.id !== id);
};

export default { getAll, findById, addRecipe, deleteById };
