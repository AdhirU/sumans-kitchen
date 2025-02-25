import { configureStore } from "@reduxjs/toolkit";

import recipeReducer from "./reducers/recipeReducer";

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
