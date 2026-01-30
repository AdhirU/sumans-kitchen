import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/authReducer";
import recipeReducer from "./reducers/recipeReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
