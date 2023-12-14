import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Cookies from "js-cookie";
import * as React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ViewTask(props) {
  const [open, setOpen] = React.useState(false);
  const [taskValue, setTaskValue] = React.useState([]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };

  const handleSubmit = async (event) => {
    console.log("hello");
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const task = {
      name: data.get("name"),
      description: data.get("description"),
      acronym: props.acronym,
    };
    try {
      //Communicate with backend using Axios request
      const res = await axios.post("http://localhost:8080/controller/createTask", task, config);
      toast.success("Task created successfully", { autoClose: 1500 });
      setOpen(false);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.errMessage);
      } else {
        toast.error("Server has issues.");
      }
    }
  };
  async function getTask() {
    try {
      const res = await axios.post(
        "http://localhost:8080/controller/getTask",
        { taskid: props.taskid },
        config
      );
      setTaskValue(res.data.data[0]);
    } catch (err) {
      if (err.response.status === 401) {
        navigate("/");
      }
    }
  }
  React.useEffect(() => {
    getTask();
  }, []);
  return (
    <React.Fragment>
      <ToastContainer
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Button variant="outlined" onClick={handleClickOpen}>
        View Task
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <Container maxWidth="lg">
          <CssBaseline />
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid container spacing={1}>
              <Grid xs={4}>
                <Typography component="h1" variant="h6">
                  App Acronym {props.acronym}
                </Typography>
                <Typography variant="h6">Task Name</Typography>
                <Typography>{taskValue.Task_name}</Typography>
                <Typography variant="h6">Task State</Typography>
                <Typography>{taskValue.Task_state}</Typography>
                <Typography variant="h6">Task Plan</Typography>
                <Typography>{taskValue.Task_plan}</Typography>
                <Typography variant="h6">Task Owner</Typography>
                <Typography>{taskValue.Task_owner}</Typography>
                <Typography variant="h6">Task Creator</Typography>
                <Typography>{taskValue.Task_state}</Typography>
                <Typography variant="h6">Task Create Date</Typography>
                <Typography>
                  {taskValue.Task_createDate && taskValue.Task_createDate.split("T")[0]}
                </Typography>
              </Grid>
              <Grid xs={8}>
                <Typography variant="h6">Task Description</Typography>
                <Typography variant="h6">Task Notes</Typography>
                <Typography variant="h6">New Notes</Typography>
              </Grid>
              <Grid xs={2}>
                <Button variant="outlined" size="large" onClick={handleClose}>
                  Close
                </Button>
              </Grid>
              <Grid xs={9}></Grid>
              <Grid xs={1}>
                <Button variant="outlined" size="large" type="submit">
                  Create
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Dialog>
    </React.Fragment>
  );
}
