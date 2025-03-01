import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import { EditOutlined } from "@mui/icons-material";

import RecipeForm from "./RecipeForm";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { NewRecipe, Recipe } from "../types";
import PageNotFound from "./PageNotFound";
import { modifyRecipe } from "../reducers/recipeReducer";

const RecipeDetail = () => {
  const isOwner = true;
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useAppDispatch();

  const id = useParams().id;
  const recipe = useAppSelector((state) =>
    state.recipes.find((r) => r.id === id)
  );

  if (!id || !recipe) {
    return <PageNotFound />;
  }

  const saveRecipe = async (newRecipe: NewRecipe) => {
    const updatedRecipe: Recipe = { ...newRecipe, id };
    await dispatch(modifyRecipe(id, updatedRecipe));
    setIsEditing(false);
  };

  return isEditing ? (
    <RecipeForm recipe={recipe} onSave={saveRecipe} />
  ) : (
    <Container sx={{ padding: 0 }}>
      <Paper
        elevation={3}
        sx={{ padding: { xs: 2, sm: 3 }, marginTop: 3, borderRadius: 2 }}
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" gutterBottom>
            {recipe.title}
          </Typography>
          {isOwner && (
            <Box>
              <Button
                variant="contained"
                sx={{
                  background: "#f8d7da",
                  color: "#9c3848",
                  display: { xs: "none", sm: "inline-flex" },
                }}
                onClick={() => setIsEditing(true)}
              >
                Edit Recipe
              </Button>
              <IconButton
                sx={{
                  display: { xs: "inline-flex", sm: "none" },
                  color: "#9c3848",
                }}
                onClick={() => setIsEditing(true)}
              >
                <EditOutlined />
              </IconButton>
            </Box>
          )}
        </Box>
        <Typography fontSize={16} sx={{ marginBottom: "16px" }}>
          {recipe.description}
        </Typography>

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h5">Ingredients:</Typography>
          <Paper
            elevation={1}
            sx={{ padding: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}
          >
            <ul>
              {recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index}>
                  <Typography fontSize={16}>{ingredient}</Typography>
                </li>
              ))}
            </ul>
          </Paper>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h5">Directions:</Typography>
          <Paper
            elevation={1}
            sx={{ padding: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}
          >
            <ul>
              {recipe.directions.map((step: string, index: number) => (
                <li key={index}>
                  <Typography fontSize={16}>{step}</Typography>
                </li>
              ))}
            </ul>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default RecipeDetail;
