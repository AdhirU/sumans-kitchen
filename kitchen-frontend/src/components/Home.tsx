import {
  Container,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks";

const Home = () => {
  const recipes = useAppSelector((state) => state.recipes);
  console.log(recipes);
  return (
    <Container sx={{ marginTop: 5 }}>
      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid key={recipe.id}>
            <Card
              component={Link}
              to={`/recipe/${recipe.id}`}
              sx={{
                display: "flex",
                width: { xs: "90vw", lg: "60vw" },
                flexDirection: "column",
                textDecoration: "none",
                height: 120, // Set a fixed height
              }}
            >
              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                {/* Recipe Title */}
                <Typography
                  variant="h6"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {recipe.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    flexGrow: 1, // Pushes elements evenly
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3, // Limit to 3 lines
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {recipe.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
