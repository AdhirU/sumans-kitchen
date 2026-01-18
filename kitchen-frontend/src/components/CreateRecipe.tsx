import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { NewRecipe } from "../types";
import RecipeForm from "./RecipeForm";
import { createRecipe } from "../reducers/recipeReducer";
import generateService from "../services/generate";
import { useAppDispatch } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AutoAwesome, Edit, Image } from "@mui/icons-material";

const emptyRecipe: NewRecipe = {
  title: "",
  description: "",
  ingredients: [""],
  directions: [""],
};

const CreateRecipe = () => {
  const [value, setValue] = useState("text");
  const [promptText, setPromptText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<NewRecipe | null>(
    emptyRecipe
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    if (newValue === "text") {
      setSelectedRecipe(emptyRecipe);
    } else {
      setSelectedRecipe(null);
    }
    setValue(newValue);
  };

  const generateFromPrompt = async () => {
    setLoading(true);
    const recipe = await generateService.fromPrompt(promptText);
    setLoading(false);
    setSelectedRecipe(recipe);
  };

  const saveRecipe = async (newRecipe: NewRecipe) => {
    const recipeId = await dispatch(createRecipe(newRecipe));
    if (recipeId) {
      navigate(`/recipe/${recipeId}`);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#2d2d2d",
            mb: 3,
            textAlign: "center",
          }}
        >
          Create New Recipe
        </Typography>
      </Container>

      <TabContext value={value}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e8e8e8",
              overflow: "hidden",
            }}
          >
            <TabList
              onChange={handleChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  px: 3,
                  minHeight: 56,
                },
                "& .Mui-selected": {
                  color: "#9c3848 !important",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#9c3848",
                },
              }}
            >
              <Tab
                icon={<Edit sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Manual Entry"
                value="text"
              />
              <Tab
                icon={<AutoAwesome sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="AI Generate"
                value="prompt"
              />
              <Tab
                icon={<Image sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="From Image"
                value="image"
              />
            </TabList>
          </Paper>

          <Box width="100%" display="flex" justifyContent="center">
            <TabPanel value="type"></TabPanel>
            <TabPanel
              sx={{
                width: { xs: "100%", md: "600px" },
                px: { xs: 2, md: 0 },
                py: 4,
              }}
              value="prompt"
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #e8e8e8",
                  background:
                    "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: "#666", textAlign: "center" }}
                >
                  Describe the recipe you want and AI will generate it for you
                </Typography>
                <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
                  <TextField
                    size="small"
                    placeholder="e.g., Spicy Thai green curry with tofu"
                    fullWidth
                    value={promptText}
                    onChange={({ target }) => setPromptText(target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#fff",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={generateFromPrompt}
                    disabled={loading || !promptText.trim()}
                    sx={{
                      px: 4,
                      background: "#9c3848",
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      "&:hover": {
                        background: "#7d2d3a",
                      },
                      "&:disabled": {
                        background: "#ccc",
                      },
                    }}
                  >
                    Generate
                  </Button>
                </Box>
              </Paper>
            </TabPanel>
            <TabPanel
              sx={{
                width: { xs: "100%", md: "600px" },
                px: { xs: 2, md: 0 },
                py: 4,
              }}
              value="image"
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: "1px dashed #ccc",
                  textAlign: "center",
                }}
              >
                <Image sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
                <Typography variant="body1" sx={{ color: "#999" }}>
                  Image upload coming soon
                </Typography>
              </Paper>
            </TabPanel>
          </Box>
        </Box>
      </TabContext>

      {loading && (
        <Box
          display="flex"
          height="40vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress sx={{ color: "#9c3848" }} />
          <Typography variant="body1" sx={{ color: "#666" }}>
            Generating your recipe...
          </Typography>
        </Box>
      )}

      {selectedRecipe && !loading && (
        <RecipeForm recipe={selectedRecipe} onSave={saveRecipe} />
      )}
    </Box>
  );
};

export default CreateRecipe;
