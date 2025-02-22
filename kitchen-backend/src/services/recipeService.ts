import recipes from "../../data/recipes";
import { NewRecipe, Recipe } from "../types";

const getAll = (): Recipe[] => {
  return recipes;
};

const findById = (id: number): Recipe | undefined => {
  const recipe = recipes.find((r) => r.id === id);
  return recipe;
};

const addRecipe = (recipe: NewRecipe) => {
  const addedRecipe = {
    id: Math.max(...recipes.map((r) => r.id)) + 1,
    ...recipe,
  };
  recipes.push(addedRecipe);
  return addedRecipe;
};

const deleteById = (id: number) => {
  recipes.filter((r) => r.id !== id);
};

export default { getAll, findById, addRecipe, deleteById };
