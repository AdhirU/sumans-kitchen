import { useState } from "react";
import {
  Container,
  Paper,
  CardMedia,
  Box,
  Typography,
  TextField,
  Button,
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
  const [imagePreview, setImagePreview] = useState(recipe.image);

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditedRecipe((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
          multiline
          variant="outlined"
          name="description"
          label="Description"
          value={editedRecipe.description}
          onChange={handleEditChange}
          sx={{ marginBottom: 2 }}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Recipe"
            style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }}
          />
        )}
        <Box textAlign="center">
          <Button
            variant="contained"
            component="label"
            sx={{ marginBottom: 2, background: "#f8d7da", color: "#9c3848" }}
          >
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h5">Ingredients:</Typography>
          <Paper
            elevation={1}
            sx={{
              padding: { xs: 1, md: 3 },
              borderRadius: 2,
              marginTop: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            {editedRecipe.ingredients.map((ingredient, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                sx={{ marginBottom: 1 }}
              >
                <TextField
                  fullWidth
                  multiline
                  size="small"
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
              sx={{ color: "#9c3848" }}
            >
              Add Ingredient
            </Button>
          </Paper>
        </Box>
        <Box>
          <Typography variant="h5">Directions:</Typography>
          <Paper
            elevation={1}
            sx={{
              padding: { xs: 1, md: 3 },
              borderRadius: 2,
              marginTop: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            {editedRecipe.directions.map((step, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                sx={{ marginBottom: 1 }}
              >
                <TextField
                  fullWidth
                  multiline
                  size="small"
                  value={step}
                  onChange={(e) =>
                    handleArrayChange(index, "directions", e.target.value)
                  }
                />
                <IconButton
                  onClick={() => handleRemoveItem(index, "directions")}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<Add />}
              onClick={() => handleAddItem("directions")}
              sx={{ color: "#9c3848" }}
            >
              Add Direction
            </Button>
          </Paper>
        </Box>
        <Box textAlign="center">
          <Button
            variant="contained"
            // color="primary"
            onClick={() => onSave(editedRecipe)}
            sx={{
              marginTop: 2,
              background: "#f8d7da",
              color: "#9c3848",
            }}
          >
            Save Recipe
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
export default RecipeForm;
