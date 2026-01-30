import { useEffect } from "react";
import {
  Container,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Restaurant } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { initializePublicRecipes } from "../reducers/recipeReducer";

const PublicRecipes = () => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(initializePublicRecipes());
  }, [dispatch]);

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
        <Typography variant="body1" sx={{ color: "#666" }}>
          {recipes.length} recipes shared by the community
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid key={recipe.id} size={12}>
            <Card
              component={Link}
              to={`/recipe/${recipe.id}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                borderRadius: 3,
                border: "1px solid #e8e8e8",
                boxShadow: "none",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "#9c3848",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(156, 56, 72, 0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box flex={1}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#2d2d2d",
                        mb: 1,
                      }}
                    >
                      {recipe.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.6,
                      }}
                    >
                      {recipe.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ml: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 1,
                    }}
                  >
                    <Chip
                      icon={<Restaurant sx={{ fontSize: 16 }} />}
                      label={`${recipe.ingredients.length} ingredients`}
                      size="small"
                      sx={{
                        backgroundColor: "#f8d7da",
                        color: "#9c3848",
                        fontWeight: 500,
                        "& .MuiChip-icon": {
                          color: "#9c3848",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PublicRecipes;
