import { useEffect } from "react";
import { Container, Grid2 as Grid, Typography, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks";
import { initializePublicRecipes } from "../reducers/recipeReducer";
import RecipeCard from "./RecipeCard";

const PublicRecipes = () => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(initializePublicRecipes());
  }, [dispatch]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#2d2d2d",
            mb: 1,
          }}
        >
          Public Recipes
        </Typography>
        <Typography variant="body1" sx={{ color: "#666" }}>
          {recipes.length} recipes shared by the community
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid key={recipe.id} size={12}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PublicRecipes;
