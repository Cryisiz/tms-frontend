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
import { useLocation, useNavigate } from "react-router-dom";
import CreateTask from "./CreateTask";

const defaultTheme = createTheme();

export default function Kanban() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { acronym } = state;
  const createPlan = () => {
    navigate("/plan", { state: { acronym: acronym } });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Appbar title={acronym} />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 4,
            pb: 6,
          }}
        ></Box>
        <Container maxWidth="false">
          <Box mb={2} paddingLeft={23}>
            <CreateTask acronym={acronym} />
            <Button onClick={createPlan} variant="outlined">
              Create Plan
            </Button>
          </Box>
        </Container>
      </main>
    </ThemeProvider>
  );
}
