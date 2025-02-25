import { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { initializeRecipes } from "./reducers/recipeReducer";
import Header from "./components/Header";
import Home from "./components/Home";
import RecipeDetail from "./components/RecipeDetail";
import CreateRecipe from "./components/CreateRecipe";
import PageNotFound from "./components/PageNotFound";
import { useAppDispatch } from "./hooks";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeRecipes());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/new-recipe" element={<CreateRecipe />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
