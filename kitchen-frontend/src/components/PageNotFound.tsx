import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "6rem", md: "8rem" },
          fontWeight: "bold",
          color: "#9c3848",
        }}
      >
        404
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: "medium", marginBottom: 2 }}>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ color: "gray", marginBottom: 4 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/"
        sx={{
          background: "#9c3848",
          color: "#fff",
          "&:hover": { background: "#7b2a3a" },
        }}
      >
        Go Home
      </Button>
    </Container>
  );
};

export default PageNotFound;
