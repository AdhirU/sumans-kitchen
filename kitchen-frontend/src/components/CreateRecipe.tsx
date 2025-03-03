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
import { Button, CircularProgress, TextField } from "@mui/material";

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
    <Box>
      <TabContext value={value}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <TabList
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              variant="scrollable"
              aria-label="lab API tabs example"
            >
              <Tab label="Enter Recipe Details" value="text" />
              <Tab label="Generate From Prompt" value="prompt" />
              <Tab label="Generate From Image" value="image" />
            </TabList>
          </Box>
          <Box width="100%" display="flex" justifyContent="center">
            <TabPanel value="type"></TabPanel>
            <TabPanel
              sx={{ width: { md: "50vw" }, padding: { xs: 2, md: 2 } }}
              value="prompt"
            >
              <Box display="flex" alignItems="center">
                <TextField
                  size="small"
                  placeholder="Example: Punjabi dal tadka extra spicy"
                  fullWidth
                  sx={{ flex: 9 }}
                  value={promptText}
                  onChange={({ target }) => setPromptText(target.value)}
                />
                <Button
                  variant="contained"
                  size="small"
                  sx={{ flex: 1, marginLeft: 2, fontSize: "0.7em" }}
                  onClick={generateFromPrompt}
                  disabled={loading}
                >
                  Generate
                </Button>
              </Box>
            </TabPanel>
            <TabPanel value="image">Development pending</TabPanel>
          </Box>
        </Box>
      </TabContext>
      {loading && (
        <Box
          display="flex"
          height="40vh"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      )}
      {selectedRecipe && (
        <RecipeForm recipe={selectedRecipe} onSave={saveRecipe} />
      )}
    </Box>
  );
};

export default CreateRecipe;
