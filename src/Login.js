import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const defaultTheme = createTheme();
export default function SignIn() {
  const navigate = useNavigate();

  //error message ui
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Authorization
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };

  //submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = {
      username: data.get("username"),
      password: data.get("password"),
    };
    //try and catch error
    try {
      //post login
      const res = await axios.post("http://localhost:8080/controller/login", user);

      //cookie
      Cookies.remove("token");
      Cookies.set("token", res.data.token, { expires: parseInt(res.data.expire) });
      //Cookies.set("username", res.data.username, { expires: 7 });
      navigate("/home");
    } catch (error) {
      setErrorMessage(error.response.data.errMessage);
      setOpen(true);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h3">
            TMS
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/*error message*/}
            {open && <Alert severity="error">{errorMessage}</Alert>}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item></Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
