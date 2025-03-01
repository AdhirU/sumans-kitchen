import { createSlice } from "@reduxjs/toolkit";
import recipesService from "../services/recipes";
import { AppDispatch } from "../store";
import { NewRecipe, Recipe } from "../types";

const initialState: Recipe[] = [];

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes(_state, action) {
      return action.payload;
    },
    appendRecipe(state, action) {
      state.push(action.payload);
    },
  },
});

export const { setRecipes, appendRecipe } = recipeSlice.actions;

export const initializeRecipes = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const recipes = await recipesService.getAll();
      dispatch(setRecipes(recipes));
    } catch {
      console.log("ERROR!!");
    }
  };
};

export const createRecipe = (recipeObject: NewRecipe) => {
  return async (dispatch: AppDispatch) => {
    try {
      const createdRecipe = await recipesService.create(recipeObject);
      dispatch(appendRecipe(createdRecipe));
      return createdRecipe.id;
    } catch {
      console.log("Error!");
    }
  };
};

export default recipeSlice.reducer;
