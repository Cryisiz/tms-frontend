import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Appbar from "./Appbar";
import { useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function MyAccount() {
  const navigate = useNavigate();
  const [defAccInfo, setDefAccInfo] = useState({
    username: "",
    email: "",
    group_list: "",
    password: "",
  });
  const [fieldDisabled, setFieldDisabled] = useState(true);
  const [editButton, setEditButton] = useState("Edit");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  //Authorization
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };
  //get default account values
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:8080/controller/getUser/", config);
        //set password in response to empty
        response.data.data.password = "";
        setDefAccInfo(response.data.data);
      } catch (err) {
        if (err.response.status === 401) {
          navigate("/");
        }
      }
    }
    fetchData();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (fieldDisabled) {
      setFieldDisabled(false);
      setEditButton("Save");
    } else {
      const data = new FormData(event.currentTarget);
      const updateEmail = { email: data.get("email") };
      try {
        const res = await axios.put(
          "http://localhost:8080/controller/updateUserEmail/",
          updateEmail,
          config
        );
        if (data.get("password") !== null && data.get("password") !== "") {
          const updatePassword = { password: data.get("password") };

          await axios.put(
            "http://localhost:8080/controller/updateUserPassword/",
            updatePassword,
            config
          );
        }
        setFieldDisabled(true);
        setEditButton("Edit");
        //if password field is not empty, set it to empty
        setDefAccInfo({
          ...defAccInfo,
          password: "",
        });
        setOpen(false);
        setErrorMessage("");
        toast.success("Account updated successfully");
      } catch (error) {
        setErrorMessage(error.response.data.errMessage);
        setOpen(true);
      }
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Appbar title="My Account" />
      <main>
        {/*Set props for toast */}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "50%" }}>
            {/* Creating box to output read-only username and group list */}
            <Grid container spacing={1}>
              <Grid xs={4}>
                <Typography component="h1" variant="h5">
                  Username: {defAccInfo.username}
                </Typography>
              </Grid>
              <Grid xs={3} style={{ flexGrow: "1" }}></Grid>
              <Grid xs={5}>
                <Typography component="h1" variant="h5">
                  Groups: {defAccInfo.group_list}
                </Typography>
              </Grid>
              <Grid xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={defAccInfo.email}
                  onChange={(e) =>
                    setDefAccInfo({
                      ...defAccInfo,
                      email: e.target.value,
                    })
                  }
                  disabled={fieldDisabled}
                  autoFocus
                />
              </Grid>

              <Grid xs={6}></Grid>
              <Grid xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={defAccInfo.password}
                  disabled={fieldDisabled}
                  onChange={(e) =>
                    setDefAccInfo({
                      ...defAccInfo,
                      password: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid style={{ flexGrow: "1" }}></Grid>
              <Grid sx={5}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  size="large"
                >
                  {editButton}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </main>
    </ThemeProvider>
  );
}
