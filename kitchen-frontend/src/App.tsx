import { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initializeRecipes } from "./reducers/recipeReducer";
import recipesService from "./services/recipes";
import Header from "./components/Header";
import Home from "./components/Home";
import RecipePage from "./components/RecipePage";
import spaghetti from "./assets/spaghetti.png";
import CreateRecipe from "./components/CreateRecipe";

const recipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    description:
      "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
    image: spaghetti,
    ingredients: [
      "Spaghetti",
      "Eggs",
      "Pancetta",
      "Parmesan Cheese",
      "Black Pepper",
    ],
    directions: [
      "Cook spaghetti",
      "Fry pancetta",
      "Mix eggs and cheese",
      "Combine all ingredients",
    ],
  },
  {
    id: 2,
    title: "Chicken Curry",
    description:
      "A flavorful curry dish with tender chicken and aromatic spices.",
    image: null,
    ingredients: [
      "Chicken",
      "Onions",
      "Tomatoes",
      "Garlic",
      "Ginger",
      "Spices",
    ],
    directions: [
      "Sauté onions and garlic",
      "Add chicken",
      "Pour in tomatoes and spices",
      "Simmer until cooked",
    ],
  },
];

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeRecipes());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/new-recipe" element={<CreateRecipe />} />
      </Routes>
    </>
  );
}

export default App;
