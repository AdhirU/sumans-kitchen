import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks";
import { login } from "../reducers/authReducer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.auth.loading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await dispatch(login(email, password));
    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          border: "1px solid #e8e8e8",
          p: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#2d2d2d",
            mb: 1,
            textAlign: "center",
          }}
        >
          Welcome back
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#666", mb: 4, textAlign: "center" }}
        >
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              backgroundColor: "#9c3848",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": {
                backgroundColor: "#7d2d3a",
              },
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: "#999" }}>
            or
          </Typography>
        </Divider>

        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "#666" }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#9c3848", fontWeight: 600 }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
