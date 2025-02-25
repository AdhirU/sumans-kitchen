import { createSlice } from "@reduxjs/toolkit";
import recipesService from "../services/recipes";
import { AppDispatch } from "../store";
import { Recipe } from "../types";

const initialState: Recipe[] = [];

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes(_state, action) {
      return action.payload;
    },
  },
});

export const { setRecipes } = recipeSlice.actions;

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

export default recipeSlice.reducer;
