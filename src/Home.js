import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Appbar from "./Appbar";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function Home() {
  const [userGroup, setUserGroup] = useState("");
  const navigate = useNavigate();
  //Authorization
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };
  useEffect(() => {
    const getUserGroup = async () => {
      try {
        const group = await axios.get("http://localhost:8080/controller/getUserGroup", config);
        setUserGroup(group.data.group_list);
      } catch (err) {
        if (err.response.status === 401) {
          navigate("/");
        }
      }
    };
    getUserGroup();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Appbar title="Home" group={userGroup} />
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm"></Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Typography variant="h1" align="center">
            [List of Apps]
          </Typography>
        </Container>
      </main>
    </ThemeProvider>
  );
}
