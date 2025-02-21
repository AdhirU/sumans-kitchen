import { createSlice } from "@reduxjs/toolkit";
import recipesService from "../services/recipes";

const recipeSlice = createSlice({
  name: "recipes",
  initialState: [],
  reducers: {
    setRecipes(_state, action) {
      return action.payload;
    },
  },
});

export const { setRecipes } = recipeSlice.actions;

export const initializeRecipes = () => {
  return async (dispatch) => {
    try {
      const recipes = await recipesService.getAll();
      dispatch(setRecipes(recipes));
    } catch (e) {
      console.log("ERROR!!");
    }
  };
};

export default recipeSlice.reducer;
