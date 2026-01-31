import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Menu as MuiMenu,
  MenuItem,
} from '@mui/material';
import {
  Menu,
  Close,
  Restaurant,
  Logout,
  Add,
  MenuBook,
  KeyboardArrowDown,
  Public,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks';
import { logout } from '../reducers/authReducer';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  // Consider user as "logged in" if we have a token (even if user data hasn't loaded yet)
  const isLoggedIn = !!user || !!token;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileOpen(false);
    handleMenuClose();
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const pages = isLoggedIn
    ? []
    : [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
      ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#f8d7da',
        boxShadow: 'none',
        borderBottom: '1px solid #f0c0c5',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          maxWidth: '900px',
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Restaurant sx={{ color: '#9c3848', fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#9c3848',
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '-0.5px',
              }}
            >
              Suman's Kitchen
            </Typography>
          </Box>
        </Link>

        {/* Navigation Links - Hidden on Small Screens */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            gap: 1,
            alignItems: 'center',
          }}
        >
          {pages.map((page) => (
            <Button
              component={Link}
              to={page.path}
              key={page.name}
              sx={{
                color: isActive(page.path) ? '#9c3848' : '#666',
                fontWeight: isActive(page.path) ? 600 : 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                px: 2,
                borderRadius: 2,
                backgroundColor: isActive(page.path)
                  ? 'rgba(255, 255, 255, 0.5)'
                  : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  color: '#9c3848',
                },
              }}
            >
              {page.name}
            </Button>
          ))}
          {isLoggedIn && (
            <>
              <Button
                onClick={handleMenuOpen}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  ml: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    color: '#9c3848',
                  },
                }}
                endIcon={<KeyboardArrowDown />}
              >
                {user?.name || ''}
              </Button>
              <MuiMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: { mt: 1, minWidth: 180 },
                }}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/');
                    handleMenuClose();
                  }}
                >
                  <Public sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
                  Public Recipes
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/my-recipes');
                    handleMenuClose();
                  }}
                >
                  <MenuBook sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
                  My Recipes
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/new-recipe');
                    handleMenuClose();
                  }}
                >
                  <Add sx={{ mr: 1.5, fontSize: 20, color: '#666' }} />
                  New Recipe
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1.5, fontSize: 20, color: '#9c3848' }} />
                  <Typography sx={{ color: '#9c3848' }}>Logout</Typography>
                </MenuItem>
              </MuiMenu>
            </>
          )}
        </Box>

        {/* Hamburger Menu Icon - Visible on Small Screens */}
        <IconButton
          sx={{
            display: { xs: 'flex', sm: 'none' },
            color: '#9c3848',
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
              backgroundColor: '#fff',
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Restaurant sx={{ color: '#9c3848', fontSize: 24 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: '#9c3848' }}
              >
                Suman's Kitchen
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#666' }}>
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
                    ? '#f8d7da'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: '#f8d7da',
                  },
                }}
              >
                <ListItemText
                  primary={page.name}
                  primaryTypographyProps={{
                    sx: {
                      color: isActive(page.path) ? '#9c3848' : '#444',
                      fontWeight: isActive(page.path) ? 600 : 500,
                    },
                  }}
                />
              </ListItem>
            ))}
            {isLoggedIn && (
              <>
                <Divider sx={{ my: 2 }} />
                <ListItem sx={{ mx: 1 }}>
                  <ListItemText
                    primary={user?.name || ''}
                    primaryTypographyProps={{
                      sx: { color: '#9c3848', fontWeight: 600 },
                    }}
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  to="/"
                  onClick={handleDrawerToggle}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    backgroundColor: isActive('/') ? '#f8d7da' : 'transparent',
                    '&:hover': { backgroundColor: '#f8d7da' },
                  }}
                >
                  <Public sx={{ mr: 1.5, color: '#666', fontSize: 20 }} />
                  <ListItemText
                    primary="Public Recipes"
                    primaryTypographyProps={{
                      sx: { color: '#444', fontWeight: 500 },
                    }}
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  to="/my-recipes"
                  onClick={handleDrawerToggle}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    backgroundColor: isActive('/my-recipes') ? '#f8d7da' : 'transparent',
                    '&:hover': { backgroundColor: '#f8d7da' },
                  }}
                >
                  <MenuBook sx={{ mr: 1.5, color: '#666', fontSize: 20 }} />
                  <ListItemText
                    primary="My Recipes"
                    primaryTypographyProps={{
                      sx: { color: '#444', fontWeight: 500 },
                    }}
                  />
                </ListItem>
                <ListItem
                  component={Link}
                  to="/new-recipe"
                  onClick={handleDrawerToggle}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    backgroundColor: isActive('/new-recipe') ? '#f8d7da' : 'transparent',
                    '&:hover': { backgroundColor: '#f8d7da' },
                  }}
                >
                  <Add sx={{ mr: 1.5, color: '#666', fontSize: 20 }} />
                  <ListItemText
                    primary="New Recipe"
                    primaryTypographyProps={{
                      sx: { color: '#444', fontWeight: 500 },
                    }}
                  />
                </ListItem>
                <ListItem
                  onClick={handleLogout}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f8d7da' },
                  }}
                >
                  <Logout sx={{ mr: 1.5, color: '#9c3848', fontSize: 20 }} />
                  <ListItemText
                    primary="Logout"
                    primaryTypographyProps={{
                      sx: { color: '#9c3848', fontWeight: 500 },
                    }}
                  />
                </ListItem>
              </>
            )}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
