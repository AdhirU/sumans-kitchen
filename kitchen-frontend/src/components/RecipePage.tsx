import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import RecipeDetail from "./RecipeDetail";
import { useParams } from "react-router-dom";

const RecipePage = () => {
  const id = useParams().id;
  console.log(id);
  const recipe = useSelector((state) =>
    state.recipes.find((r) => r.id === parseInt(id))
  );
  return recipe ? (
    <RecipeDetail recipe={recipe} />
  ) : (
    <Typography>Recipe not found.</Typography>
  );
};

export default RecipePage;
