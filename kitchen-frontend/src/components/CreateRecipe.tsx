import RecipeForm from "./RecipeForm";

const CreateRecipe = () => {
  return (
    <RecipeForm
      onSave={(newRecipe) => console.log("New Recipe Saved:", newRecipe)}
    />
  );
};

export default CreateRecipe;
