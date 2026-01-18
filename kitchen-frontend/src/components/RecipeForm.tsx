import { useState, ChangeEvent } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Avatar,
} from "@mui/material";
import { Add, Delete, Restaurant, CheckCircleOutline } from "@mui/icons-material";
import { NewRecipe } from "../types";

interface Props {
  recipe: NewRecipe;
  onSave: (newRecipe: NewRecipe) => Promise<void>;
}

type arrayFields = "ingredients" | "directions";

const RecipeForm = ({ recipe, onSave }: Props) => {
  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await onSave(editedRecipe);
    setLoading(false);
  };

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

  return (
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
        <TextField
          fullWidth
          variant="outlined"
          name="title"
          label="Recipe Title"
          value={editedRecipe.title}
          onChange={handleEditChange}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              fontSize: "1.25rem",
              fontWeight: 600,
            },
          }}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          name="description"
          label="Description"
          value={editedRecipe.description}
          onChange={handleEditChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
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
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#2d2d2d" }}>
            Ingredients
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {editedRecipe.ingredients.map((ingredient, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#9c3848",
                mr: 2,
                flexShrink: 0,
              }}
            />
            <TextField
              fullWidth
              size="small"
              placeholder={`Ingredient ${index + 1}`}
              value={ingredient}
              onChange={(e) =>
                handleArrayChange(index, "ingredients", e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                },
              }}
            />
            <IconButton
              onClick={() => handleRemoveItem(index, "ingredients")}
              sx={{
                ml: 1,
                color: "#999",
                "&:hover": { color: "#d32f2f" },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        ))}

        <Button
          startIcon={<Add />}
          onClick={() => handleAddItem("ingredients")}
          sx={{
            mt: 1,
            color: "#9c3848",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#f8d7da",
            },
          }}
        >
          Add Ingredient
        </Button>
      </Paper>

      {/* Directions Section */}
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
          <CheckCircleOutline sx={{ color: "#9c3848", mr: 1.5, fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#2d2d2d" }}>
            Directions
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {editedRecipe.directions.map((step, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="flex-start"
            sx={{ mb: 2 }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                backgroundColor: "#9c3848",
                fontSize: "0.85rem",
                fontWeight: 600,
                mr: 2,
                mt: 0.5,
                flexShrink: 0,
              }}
            >
              {index + 1}
            </Avatar>
            <TextField
              fullWidth
              multiline
              size="small"
              placeholder={`Step ${index + 1}`}
              value={step}
              onChange={(e) =>
                handleArrayChange(index, "directions", e.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                },
              }}
            />
            <IconButton
              onClick={() => handleRemoveItem(index, "directions")}
              sx={{
                ml: 1,
                color: "#999",
                "&:hover": { color: "#d32f2f" },
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        ))}

        <Button
          startIcon={<Add />}
          onClick={() => handleAddItem("directions")}
          sx={{
            mt: 1,
            color: "#9c3848",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#f8d7da",
            },
          }}
        >
          Add Step
        </Button>
      </Paper>

      {/* Save Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={loading}
          sx={{
            px: 6,
            py: 1.5,
            background: "#9c3848",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
            "&:hover": {
              background: "#7d2d3a",
            },
            "&:disabled": {
              background: "#ccc",
            },
          }}
        >
          {loading ? "Saving..." : "Save Recipe"}
        </Button>
      </Box>
    </Container>
  );
};

export default RecipeForm;
