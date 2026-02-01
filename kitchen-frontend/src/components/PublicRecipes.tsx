import { useCallback, useState } from "react";
import { Container, Grid2 as Grid, Typography, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks";
import { initializePublicRecipes } from "../reducers/recipeReducer";
import RecipeCard from "./RecipeCard";
import SearchBar from "./SearchBar";

const PublicRecipes = () => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state.recipes);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      dispatch(initializePublicRecipes(query || undefined));
    },
    [dispatch]
  );

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
        <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
          {recipes.length} recipes shared by the community
        </Typography>

        <SearchBar onSearch={handleSearch} placeholder="Search recipes..." />
      </Box>

      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid key={recipe.id} size={12}>
            <RecipeCard recipe={recipe} />
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

export default PublicRecipes;
