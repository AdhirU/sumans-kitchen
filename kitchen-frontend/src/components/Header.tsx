import { useState } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const pages = ["All Recipes", "My Recipes", "Upload New Recipe", "Login"];

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
            <MenuItem key={page} sx={{ color: "black" }}>
              {page}
            </MenuItem>
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
              <ListItem button key={page} onClick={handleDrawerToggle}>
                <ListItemText primary={page} />
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
