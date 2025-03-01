import { NewRecipe } from "../types";
import RecipeForm from "./RecipeForm";
import { createRecipe } from "../reducers/recipeReducer";
import { useAppDispatch } from "../hooks";
import { useNavigate } from "react-router-dom";

const CreateRecipe = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const saveRecipe = async (newRecipe: NewRecipe) => {
    const recipeId = await dispatch(createRecipe(newRecipe));
    if (recipeId) {
      navigate(`/recipe/${recipeId}`);
    }
  };

  const emptyRecipe: NewRecipe = {
    title: "",
    description: "",
    ingredients: [""],
    directions: [""],
  };

  return <RecipeForm recipe={emptyRecipe} onSave={saveRecipe} />;
};

export default CreateRecipe;
