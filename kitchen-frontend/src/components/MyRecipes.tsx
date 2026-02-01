import { useCallback, useState } from "react";
import { Container, Grid2 as Grid, Typography, Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { initializeMyRecipes } from "../reducers/recipeReducer";
import RecipeCard from "./RecipeCard";
import SearchBar from "./SearchBar";

const MyRecipes = () => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state.recipes);
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      dispatch(initializeMyRecipes(query || undefined));
    },
    [dispatch]
  );

  // Wait for auth to load before deciding to redirect
  // If we have a token but no user yet, the user is still being loaded
  if (token && !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: '#9c3848' }} />
      </Box>
    );
  }

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
        <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
          {recipes.length} recipes in your collection
        </Typography>

        <SearchBar onSearch={handleSearch} placeholder="Search your recipes..." />
      </Box>

      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid key={recipe.id} size={12}>
            <RecipeCard recipe={recipe} showPublicBadge />
          </Grid>
        ))}
      </Grid>

      {recipes.length === 0 && searchQuery && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" sx={{ color: "#666" }}>
            No recipes found for "{searchQuery}"
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MyRecipes;
