import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = ({ setAuth }) => {
  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const response = await axios.post("https://api.fit-vut.cz/login", {
        username,
        password,
      });

      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message,
      );
      return false;
    }
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = () => {
    if (login(username, password) === true) {
      console.log("redirecting");
      setAuth(true);
      navigate("/dashboard");
    } else {
      setAuth(false);
      setError(true);
      setErrorMsg("Login failed.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        backgroundColor: "primary",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h2" color="primary" align="center" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography
            variant="body2"
            color="error"
            align="center"
            sx={{
              py: 1.5,
              fontWeight: 500,
            }}
          >
            {errorMsg}
          </Typography>
        )}
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="User"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 1,
              fontSize: "1rem",
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
