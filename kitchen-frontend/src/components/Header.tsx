import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const pages = [
  { name: "All Recipes", path: "/" },
  { name: "My Recipes", path: "/my-recipes" },
  { name: "Upload New Recipe", path: "/upload" },
  { name: "Login", path: "/login" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#f8d7da", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#9c3848", fontFamily: "serif" }}
        >
          Suman's <span style={{ fontWeight: "normal" }}>Kitchen</span>
        </Typography>

        {/* Navigation Links - Hidden on Small Screens */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {pages.map((page) => (
            <Link to={page.path} key={page.name}>
              <MenuItem sx={{ color: "black" }}>{page.name}</MenuItem>
            </Link>
          ))}
        </Box>

        {/* Hamburger Menu Icon - Visible on Small Screens */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" }, color: "black" }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer for Mobile Menu */}
        <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
          <List sx={{ width: 250 }}>
            {pages.map((page) => (
              <ListItem
                component={Link}
                to={page.path}
                key={page.name}
                onClick={handleDrawerToggle}
              >
                <ListItemText primary={page.name} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Icons */}
        {/* <Box sx={{ display: "flex", gap: 1.5 }}>
          <IconButton sx={{ color: "black" }}>
            <SearchIcon />
          </IconButton>
          <IconButton sx={{ color: "black" }}>
            <PersonIcon />
          </IconButton>
          <IconButton sx={{ color: "black" }}>
            <ShoppingCartIcon />
          </IconButton>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
}
