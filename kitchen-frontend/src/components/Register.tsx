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
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAppDispatch, useAppSelector } from "../hooks";
import { register, googleLogin } from "../reducers/authReducer";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.auth.loading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const success = await dispatch(register(email, password, name));
    if (success) {
      navigate("/");
    } else {
      setError("Email already registered");
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (response.credential) {
      const success = await dispatch(googleLogin(response.credential));
      if (success) {
        navigate("/");
      } else {
        setError("Google sign-up failed");
      }
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
          Create an account
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#666", mb: 4, textAlign: "center" }}
        >
          Start saving your recipes
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
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
            helperText="At least 8 characters"
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
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: "#999" }}>
            or
          </Typography>
        </Divider>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google sign-up failed")}
            text="signup_with"
          />
        </Box>

        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "#666" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#9c3848", fontWeight: 600 }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
