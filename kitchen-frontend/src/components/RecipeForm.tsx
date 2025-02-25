import { useState, ChangeEvent } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { NewRecipe } from "../types";

interface Props {
  recipe: NewRecipe;
  onSave: (newRecipe: NewRecipe) => void;
}

type arrayFields = "ingredients" | "directions";

const RecipeForm = ({ recipe, onSave }: Props) => {
  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });
  const [imagePreview, setImagePreview] = useState(recipe.image);

  const handleEditChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    index: number,
    field: arrayFields,
    value: string
  ) => {
    setEditedRecipe((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleAddItem = (field: arrayFields) => {
    setEditedRecipe((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveItem = (index: number, field: arrayFields) => {
    setEditedRecipe((prev) => {
      const updatedArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setEditedRecipe((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(files[0]);
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
