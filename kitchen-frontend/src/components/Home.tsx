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
          <Grid key={recipe.id} width="100%">
            <Card
              component={Link}
              to={`/recipe/${recipe.id}`}
              sx={{ display: "flex", textDecoration: "none" }}
            >
              <CardContent>
                <Typography variant="h6">{recipe.title}</Typography>
                <Typography variant="body2" color="textSecondary">
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
