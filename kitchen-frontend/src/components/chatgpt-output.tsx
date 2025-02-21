import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const RecipeForm = ({
  recipe = {
    title: "",
    description: "",
    ingredients: [""],
    directions: [""],
    image: "",
  },
  onSave,
}) => {
  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditedRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value) => {
    setEditedRecipe((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleAddItem = (field) => {
    setEditedRecipe((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveItem = (index, field) => {
    setEditedRecipe((prev) => {
      const updatedArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updatedArray };
    });
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          name="title"
          label="Title"
          value={editedRecipe.title}
          onChange={handleEditChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          name="description"
          label="Description"
          value={editedRecipe.description}
          onChange={handleEditChange}
          sx={{ marginBottom: 2 }}
        />
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Ingredients:</Typography>
          {editedRecipe.ingredients.map((ingredient, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              sx={{ marginBottom: 1 }}
            >
              <TextField
                fullWidth
                value={ingredient}
                onChange={(e) =>
                  handleArrayChange(index, "ingredients", e.target.value)
                }
              />
              <IconButton
                onClick={() => handleRemoveItem(index, "ingredients")}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<Add />}
            onClick={() => handleAddItem("ingredients")}
          >
            Add Ingredient
          </Button>
        </Box>
        <Box>
          <Typography variant="h6">Directions:</Typography>
          {editedRecipe.directions.map((step, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              sx={{ marginBottom: 1 }}
            >
              <TextField
                fullWidth
                value={step}
                onChange={(e) =>
                  handleArrayChange(index, "directions", e.target.value)
                }
              />
              <IconButton onClick={() => handleRemoveItem(index, "directions")}>
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<Add />}
            onClick={() => handleAddItem("directions")}
          >
            Add Direction
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave(editedRecipe)}
          sx={{ marginTop: 2 }}
        >
          Save Recipe
        </Button>
      </Paper>
    </Container>
  );
};

const RecipeDetail = ({ recipe, user }) => {
  const isOwner = user && user.id === recipe.ownerId;
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <RecipeForm recipe={recipe} onSave={() => setIsEditing(false)} />
  ) : (
    <Container>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          {recipe.title}
        </Typography>
        <Typography fontSize={16} sx={{ marginBottom: "16px" }}>
          {recipe.description}
        </Typography>
        {isOwner && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsEditing(true)}
          >
            Edit Recipe
          </Button>
        )}
      </Paper>
    </Container>
  );
};

const CreateRecipe = () => {
  return (
    <RecipeForm
      onSave={(newRecipe) => console.log("New Recipe Saved:", newRecipe)}
    />
  );
};
