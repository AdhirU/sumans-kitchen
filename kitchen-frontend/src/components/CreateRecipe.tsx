import { NewRecipe } from "../types";
import RecipeForm from "./RecipeForm";

const CreateRecipe = () => {
  const emptyRecipe: NewRecipe = {
    title: "",
    description: "",
    ingredients: [""],
    directions: [""],
  };
  return (
    <RecipeForm
      recipe={emptyRecipe}
      onSave={(newRecipe) => console.log("New Recipe Saved:", newRecipe)}
    />
  );
};

export default CreateRecipe;
