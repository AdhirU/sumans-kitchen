import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  Paper,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { Add, Delete, EditOutlined } from "@mui/icons-material";

import RecipeForm from "./RecipeForm";

const RecipeDetail = ({ recipe, user }) => {
  const isOwner = true;
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <RecipeForm recipe={recipe} onSave={() => setIsEditing(false)} />
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
        {recipe.image && (
          <Box
            component="img"
            display="block"
            margin="auto"
            maxHeight={450}
            alt={recipe.title}
            src={recipe.image}
            sx={{
              width: { md: "70%", xs: "100%" },
              borderRadius: 2,
              marginBottom: 2,
            }}
          />
        )}

        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h5">Ingredients:</Typography>
          <Paper
            elevation={1}
            sx={{ padding: 3, borderRadius: 2, backgroundColor: "#f9f9f9" }}
          >
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
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
              {recipe.directions.map((step, index) => (
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
