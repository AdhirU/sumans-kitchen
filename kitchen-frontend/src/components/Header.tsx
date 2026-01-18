import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import { Menu, Close, Restaurant } from "@mui/icons-material";

const pages = [
  { name: "All Recipes", path: "/" },
  { name: "My Recipes", path: "/my-recipes" },
  { name: "New Recipe", path: "/new-recipe" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#f8d7da",
        boxShadow: "none",
        borderBottom: "1px solid #f0c0c5",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "900px",
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Restaurant sx={{ color: "#9c3848", fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#9c3848",
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "-0.5px",
              }}
            >
              Suman's Kitchen
            </Typography>
          </Box>
        </Link>

        {/* Navigation Links - Hidden on Small Screens */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          {pages.map((page) => (
            <Button
              component={Link}
              to={page.path}
              key={page.name}
              sx={{
                color: isActive(page.path) ? "#9c3848" : "#666",
                fontWeight: isActive(page.path) ? 600 : 500,
                textTransform: "none",
                fontSize: "0.95rem",
                px: 2,
                borderRadius: 2,
                backgroundColor: isActive(page.path)
                  ? "rgba(255, 255, 255, 0.5)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  color: "#9c3848",
                },
              }}
            >
              {page.name}
            </Button>
          ))}
        </Box>

        {/* Hamburger Menu Icon - Visible on Small Screens */}
        <IconButton
          sx={{
            display: { xs: "flex", md: "none" },
            color: "#9c3848",
          }}
          onClick={handleDrawerToggle}
        >
          <Menu />
        </IconButton>

        {/* Drawer for Mobile Menu */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          PaperProps={{
            sx: {
              width: 280,
              backgroundColor: "#fff",
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Restaurant sx={{ color: "#9c3848", fontSize: 24 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#9c3848" }}
              >
                Suman's Kitchen
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "#666" }}>
              <Close />
            </IconButton>
          </Box>
          <Divider />
          <List sx={{ pt: 2 }}>
            {pages.map((page) => (
              <ListItem
                component={Link}
                to={page.path}
                key={page.name}
                onClick={handleDrawerToggle}
                sx={{
                  mx: 1,
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: isActive(page.path)
                    ? "#f8d7da"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "#f8d7da",
                  },
                }}
              >
                <ListItemText
                  primary={page.name}
                  primaryTypographyProps={{
                    sx: {
                      color: isActive(page.path) ? "#9c3848" : "#444",
                      fontWeight: isActive(page.path) ? 600 : 500,
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
