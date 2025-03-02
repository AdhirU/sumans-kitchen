import { INewRecipe, IRecipe } from "../types";
import Recipe from "../models/recipe";

const getAll = async () => {
  const recipes = await Recipe.find<IRecipe>({});
  return recipes;
};

const findById = async (id: string) => {
  const recipe = await Recipe.findById(id);
  return recipe;
};

const addRecipe = async (recipe: INewRecipe) => {
  const recipeToAdd = new Recipe(recipe);

  const savedRecipe = await recipeToAdd.save();
  return savedRecipe;
};

const updateRecipe = async (id: string, recipe: IRecipe) => {
  const updatedRecipe = await Recipe.findByIdAndUpdate(id, recipe, {
    new: true,
  });
  return updatedRecipe;
};

const deleteById = async (id: string) => {
  await Recipe.findByIdAndDelete(id);
};

export default { getAll, findById, addRecipe, updateRecipe, deleteById };
