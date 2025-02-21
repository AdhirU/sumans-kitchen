import { createSlice } from "@reduxjs/toolkit";

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

export default recipeSlice.reducer;
