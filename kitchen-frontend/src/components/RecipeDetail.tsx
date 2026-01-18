import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  EditOutlined,
  Restaurant,
  CheckCircleOutline,
} from "@mui/icons-material";

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
          border: "1px solid #f0e0e0",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box flex={1}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#2d2d2d",
                mb: 2,
                fontSize: { xs: "1.75rem", sm: "2.5rem" },
              }}
            >
              {recipe.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#666",
                lineHeight: 1.8,
                fontSize: "1.1rem",
              }}
            >
              {recipe.description}
            </Typography>
          </Box>
          {isOwner && (
            <Box sx={{ ml: 2 }}>
              <Button
                variant="contained"
                startIcon={<EditOutlined />}
                sx={{
                  background: "#9c3848",
                  color: "#fff",
                  display: { xs: "none", sm: "inline-flex" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  "&:hover": {
                    background: "#7d2d3a",
                  },
                }}
                onClick={() => setIsEditing(true)}
              >
                Edit Recipe
              </Button>
              <IconButton
                sx={{
                  display: { xs: "inline-flex", sm: "none" },
                  color: "#fff",
                  background: "#9c3848",
                  "&:hover": {
                    background: "#7d2d3a",
                  },
                }}
                onClick={() => setIsEditing(true)}
              >
                <EditOutlined />
              </IconButton>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Ingredients Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 3,
          borderRadius: 3,
          border: "1px solid #e8e8e8",
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Restaurant sx={{ color: "#9c3848", mr: 1.5, fontSize: 28 }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#2d2d2d" }}
          >
            Ingredients
          </Typography>
          <Chip
            label={`${recipe.ingredients.length} items`}
            size="small"
            sx={{
              ml: 2,
              backgroundColor: "#f8d7da",
              color: "#9c3848",
              fontWeight: 500,
            }}
          />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List disablePadding>
          {recipe.ingredients.map((ingredient: string, index: number) => (
            <ListItem
              key={index}
              sx={{
                py: 1,
                px: 0,
                borderBottom:
                  index < recipe.ingredients.length - 1
                    ? "1px dashed #e8e8e8"
                    : "none",
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#9c3848",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={ingredient}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "1rem",
                      color: "#444",
                    },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Directions Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: "1px solid #e8e8e8",
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <CheckCircleOutline sx={{ color: "#9c3848", mr: 1.5, fontSize: 28 }} />
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#2d2d2d" }}
          >
            Directions
          </Typography>
          <Chip
            label={`${recipe.directions.length} steps`}
            size="small"
            sx={{
              ml: 2,
              backgroundColor: "#f8d7da",
              color: "#9c3848",
              fontWeight: 500,
            }}
          />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List disablePadding>
          {recipe.directions.map((step: string, index: number) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              sx={{
                py: 2,
                px: 0,
                borderBottom:
                  index < recipe.directions.length - 1
                    ? "1px solid #f0f0f0"
                    : "none",
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: "#9c3848",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {index + 1}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={step}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "1.05rem",
                      lineHeight: 1.7,
                      color: "#444",
                    },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default RecipeDetail;
