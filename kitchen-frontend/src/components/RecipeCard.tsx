import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Restaurant, Public } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Recipe } from "../types";

interface Props {
  recipe: Recipe;
  showPublicBadge?: boolean;
}

const RecipeCard = ({ recipe, showPublicBadge = false }: Props) => {
  return (
    <Card
      component={Link}
      to={`/recipe/${recipe.id}`}
      sx={{
        display: "flex",
        textDecoration: "none",
        borderRadius: 3,
        border: "1px solid #e8e8e8",
        boxShadow: "none",
        overflow: "hidden",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "#9c3848",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(156, 56, 72, 0.1)",
        },
      }}
    >
      {recipe.image_url && (
        <Box
          sx={{
            p: 2,
            pr: 0,
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={recipe.image_url}
            alt={recipe.title}
            sx={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
        </Box>
      )}
      <CardContent sx={{ p: 3, flex: 1 }}>
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
            {showPublicBadge && recipe.is_public && (
              <Chip
                icon={<Public sx={{ fontSize: 14 }} />}
                label="Public"
                size="small"
                sx={{
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  fontWeight: 500,
                  "& .MuiChip-icon": {
                    color: "#2e7d32",
                  },
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
