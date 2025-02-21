import {
  Container,
  Grid2 as Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const recipes = useSelector((state) => state.recipes);
  console.log(recipes);
  return (
    <Container sx={{ marginTop: 5 }}>
      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item xs={12} key={recipe.id} width="100%">
            <Card
              component={Link}
              to={`/recipe/${recipe.id}`}
              sx={{ display: "flex", textDecoration: "none" }}
            >
              <Box sx={{ width: 150, padding: 2, height: "6em" }}>
                {recipe.image ? (
                  <CardMedia
                    component="img"
                    image={recipe.image}
                    alt={recipe.title}
                  />
                ) : null}
              </Box>
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
