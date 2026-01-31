import { useEffect } from "react";
import { Container, Grid2 as Grid, Typography, Box } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { initializeMyRecipes } from "../reducers/recipeReducer";
import RecipeCard from "./RecipeCard";

const MyRecipes = () => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state.recipes);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(initializeMyRecipes());
    }
  }, [dispatch, user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
          My Recipes
        </Typography>
        <Typography variant="body1" sx={{ color: "#666" }}>
          {recipes.length} recipes in your collection
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid key={recipe.id} size={12}>
            <RecipeCard recipe={recipe} showPublicBadge />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyRecipes;
