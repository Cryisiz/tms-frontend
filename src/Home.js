import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Appbar from "./Appbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TextField } from "@mui/material";
import CreatableSelect from "react-select/creatable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

const defaultTheme = createTheme();

export default function Home() {
  const navigate = useNavigate();
  const [call, setCall] = useState(0);
  const [app, setApp] = useState({
    application: "",
    startDate: "",
    endDate: "",
    permCreate: "",
    permOpen: "",
    permToDo: "",
    permDoing: "",
    permDone: "",
    description: "",
    rnum: "",
  });
  const [table, setTable] = useState([]);
  const [groupOptions, setGroupOptions] = React.useState([]);
  async function fetchData() {
    try {
      const res = await axios.get("http://localhost:8080/controller/getAllApp/", config);
      //set app to table default edit disabled
      setTable(
        res.data.data.map((apps) => {
          return { ...apps, editDisabled: true };
        })
      );
    } catch (err) {
      if (err.response.status === 401) {
        navigate("/");
      }
    }
  }
  const Go = (acronym) => {
    navigate("/kanban", { state: { acronym: acronym } });
  };

  async function handleSubmit(e, row) {
    e.preventDefault();
    //strip the _button from the id
    const id = e.target.id.replace("_button", "");
    const disabled = table.find((row) => row.App_Acronym === id).editDisabled;
    if (disabled) {
      //set edit disabled to false for the specific row
      setTable(
        table.map((row) => {
          if (row.App_Acronym === id) {
            row.editDisabled = false;
          }
          return row;
        })
      );
    } else if (!disabled) {
      //get the values for the row from the table state
      const startDate = table.find((row) => row.App_Acronym === id).App_startDate;
      const endDate = table.find((row) => row.App_Acronym === id).App_endDate;
      const description = table.find((row) => row.App_Acronym === id).App_Description;
      const permCreate = table.find((row) => row.App_Acronym === id).App_permit_create;
      const permOpen = table.find((row) => row.App_Acronym === id).App_permit_Open;
      const permToDo = table.find((row) => row.App_Acronym === id).App_permit_toDoList;
      const permDoing = table.find((row) => row.App_Acronym === id).App_permit_Doing;
      const permDone = table.find((row) => row.App_Acronym === id).App_permit_Done;
      const body = {};
      if (startDate !== "" && startDate !== undefined) {
        body.startDate = startDate;
      }
      if (endDate !== "" && endDate !== undefined) {
        body.endDate = endDate;
      }
      if (description !== "" && description !== undefined) {
        body.description = description;
      }
      body.permCreate = permCreate;
      body.permOpen = permOpen;
      body.permToDo = permToDo;
      body.permDoing = permDoing;
      body.permDone = permDone;
      try {
        const response = await axios.put(
          "http://localhost:8080/controller/updateApp/" + row.App_Acronym,
          body,
          config
        );
        toast.success(response.data.message, { autoClose: 1500 });
        setCall(call + 1);
        setTable(
          table.map((row) => {
            if (row.App_Acronym === id) {
              row.App_startDate = startDate;
              row.App_endDate = endDate;
              row.App_Description = description;
              row.editDisabled = true;
            }
            return row;
          })
        );
      } catch (err) {
        toast.error(err.response.data.errMessage);
        if (err.response.status === 401) {
          navigate("/");
        }
      }
    }
  }

  async function handleDisable(e, row) {
    e.preventDefault();
    const apps = row.App_Acronym;
    try {
      const response = await axios.put(
        "http://localhost:8080/controller/toggleUserStatus/" + apps,
        {},
        config
      );
      toast.success(response.data.message, { autoClose: 1500 });
      setCall(call + 1);
      setTable(
        table.map((row) => {
          if (row.App_Acronym === apps) {
            row.is_disabled = row.is_disabled === 0 ? 1 : 0;
          }
          return row;
        })
      );
    } catch (err) {
      toast.error(err.response.data.errMessage);
      if (err.response.status === 401) {
        navigate("/");
      }
    }
  }

  async function createApp(e) {
    //we need to reinit the config incase the token has changed
    config.headers.Authorization = "Bearer " + Cookies.get("token");
    e.preventDefault();
    const body = {
      application: app.application,
      startDate: app.startDate,
      endDate: app.endDate,
      description: app.description,
      permCreate: app.permCreate,
      permOpen: app.permOpen,
      permToDo: app.permToDo,
      permDoing: app.permDoing,
      permDone: app.permDone,
      rnum: app.rnum,
    };
    try {
      const res = await axios.post("http://localhost:8080/controller/createApp", body, config);
      toast.success(res.data.message, { autoClose: 1500 });
      setApp({
        application: "",
        startDate: "",
        endDate: "",
        permCreate: "",
        permOpen: "",
        permToDo: "",
        permDoing: "",
        permDone: "",
        description: "",
        rnum: "",
      });
      fetchData();
    } catch (err) {
      toast.error(err.response.data.errMessage);
      if (err.response.status === 401) {
        navigate("/");
      }
    }
  }

  function getGroupsValue(value) {
    return { value: value.group_name, label: value.group_name };
  }

  //Authorization
  const config = {
    headers: {
      Authorization: "Bearer " + Cookies.get("token"),
    },
  };

  //Run once on page load
  //use Axios to get all app
  useEffect(() => {
    fetchData();
    getGroups();
  }, []);

  const getGroups = async () => {
    try {
      const res = await axios.get("http://localhost:8080/controller/getGroups", config);
      setGroupOptions(res.data.data.map(getGroupsValue));
    } catch (err) {
      if (err.response.status === 401) {
        navigate("/");
      }
    }
  };

  function Child(props) {
    useEffect(() => {});
    const [item, setItem] = useState(props.item);

    const onChange = (event) => {
      let newValue = event.target.value;
      setItem((prevState) => {
        let newItem = { type: props.id, content: newValue };

        props.onChange(props.index, newItem);

        return newValue;
      });
    };
    return (
      <TextField
        value={item}
        onChange={onChange}
        margin="dense"
        fullWidth
        disabled={props.disabled}
        type={props.id}
        placeholder={props.placeholder}
        multiline={props.multiline}
        rows={props.rows}
        label={props.label}
      ></TextField>
    );
  }
  function CreateRow(props) {
    const [state, setState] = useState(app, []);

    useEffect(() => {});

    const onInputChange = (index, item) => {
      state[item.type] = item.content;
    };

    return (
      <>
        <TableRow key={state.application} noValidate>
          <TableCell align="center" width={150}>
            <Child
              id={"application"}
              item={state.application}
              onChange={onInputChange}
              disabled={false}
            />
          </TableCell>
          <TableCell align="center" width={150}>
            <Child
              id={"startDate"}
              item={state.startDate}
              onChange={onInputChange}
              disabled={false}
              placeholder={"dd/mm/yyyy"}
              label={"Start Date"}
            />
            <Child
              id={"endDate"}
              item={state.endDate}
              onChange={onInputChange}
              disabled={false}
              placeholder={"dd/mm/yyyy"}
              label={"End Date"}
            />
          </TableCell>
          <TableCell align="center" width={100}>
            <Child id={"rnum"} item={state.rnum} onChange={onInputChange} disabled={false} />
          </TableCell>
          <TableCell align="center" width={400}>
            <Child
              id={"description"}
              item={state.description}
              onChange={onInputChange}
              disabled={false}
              multiline={true}
              rows={3}
            />
          </TableCell>
          <TableCell align="center">
            <Select
              onChange={(event) =>
                setApp({
                  ...app,
                  permCreate: event ? event.value : "",
                })
              }
              name="colors"
              options={groupOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={groupOptions.find((option) => option.value === app.permCreate)}
              isClearable={true}
            />
          </TableCell>
          <TableCell align="center">
            <Select
              onChange={(event) =>
                setApp({
                  ...app,
                  permOpen: event ? event.value : "",
                })
              }
              name="colors"
              options={groupOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={groupOptions.find((option) => option.value === app.permOpen)}
              isClearable={true}
            />
          </TableCell>
          <TableCell align="center">
            <Select
              onChange={(event) =>
                setApp({
                  ...app,
                  permToDo: event ? event.value : "",
                })
              }
              name="colors"
              options={groupOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={groupOptions.find((option) => option.value === app.permToDo)}
              isClearable={true}
            />
          </TableCell>
          <TableCell align="center">
            <Select
              onChange={(event) =>
                setApp({
                  ...app,
                  permDoing: event ? event.value : "",
                })
              }
              name="colors"
              options={groupOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={groupOptions.find((option) => option.value === app.permDoing)}
              isClearable={true}
            />
          </TableCell>
          <TableCell align="center">
            <Select
              onChange={(event) =>
                setApp({
                  ...app,
                  permDone: event ? event.value : "",
                })
              }
              name="colors"
              options={groupOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              value={groupOptions.find((option) => option.value === app.permDone)}
              isClearable={true}
            />
          </TableCell>
          <TableCell align="center">
            <Button variant="outlined" onClick={createApp}>
              Create
            </Button>
          </TableCell>
        </TableRow>
      </>
    );
  }

  function Parent(props) {
    const [state, setState] = useState(table, []);
    const onInputChange = (index, item) => {
      state[index][item.type] = item.content;
    };
    return (
      <>
        {state.map((item, index) => (
          <TableRow key={item.App_Acronym} noValidate>
            <TableCell align="center">{item.App_Acronym}</TableCell>
            <TableCell align="center">
              <Child
                id={"App_startDate"}
                item={item.App_startDate}
                index={index}
                onChange={onInputChange}
                disabled={item.editDisabled}
              />
              <Child
                id={"App_endDate"}
                item={item.App_endDate}
                index={index}
                onChange={onInputChange}
                disabled={item.editDisabled}
              />
            </TableCell>
            <TableCell align="center">{item.App_Rnumber}</TableCell>
            <TableCell align="center">
              <Child
                id={"App_Description"}
                index={index}
                item={item.App_Description}
                onChange={onInputChange}
                disabled={item.editDisabled}
                multiline={true}
                rows={3}
              />
            </TableCell>

            <TableCell align="center">
              <Select
                isDisabled={item.editDisabled}
                onChange={(event) =>
                  //combine the values into a comma separated string

                  setTable(
                    table.map((row) => {
                      if (row.App_Acronym === item.App_Acronym) {
                        row.App_permit_create = event ? event.value : "";
                      }
                      return row;
                    })
                  )
                }
                isClearable={true}
                name="colors"
                options={groupOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                //read from app.group_list and match exactly
                value={groupOptions.find((option) => option.value === item.App_permit_create)}
              />
            </TableCell>
            <TableCell align="center">
              <Select
                isDisabled={item.editDisabled}
                onChange={(event) =>
                  //combine the values into a comma separated string

                  setTable(
                    table.map((row) => {
                      if (row.App_Acronym === item.App_Acronym) {
                        row.App_permit_Open = event ? event.value : "";
                      }
                      return row;
                    })
                  )
                }
                isClearable={true}
                name="colors"
                options={groupOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                //read from app.group_list and match exactly
                value={groupOptions.find((option) => option.value === item.App_permit_Open)}
              />
            </TableCell>
            <TableCell align="center">
              <Select
                isDisabled={item.editDisabled}
                onChange={(event) =>
                  //combine the values into a comma separated string

                  setTable(
                    table.map((row) => {
                      if (row.App_Acronym === item.App_Acronym) {
                        row.App_permit_toDoList = event ? event.value : "";
                      }
                      return row;
                    })
                  )
                }
                isClearable={true}
                name="colors"
                options={groupOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                //read from app.group_list and match exactly
                value={groupOptions.find((option) => option.value === item.App_permit_toDoList)}
              />
            </TableCell>
            <TableCell align="center">
              <Select
                isDisabled={item.editDisabled}
                onChange={(event) =>
                  //combine the values into a comma separated string

                  setTable(
                    table.map((row) => {
                      if (row.App_Acronym === item.App_Acronym) {
                        row.App_permit_Doing = event ? event.value : "";
                      }
                      return row;
                    })
                  )
                }
                isClearable={true}
                name="colors"
                options={groupOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                //read from app.group_list and match exactly
                value={groupOptions.find((option) => option.value === item.App_permit_Doing)}
              />
            </TableCell>
            <TableCell align="center">
              <Select
                isDisabled={item.editDisabled}
                onChange={(event) =>
                  //combine the values into a comma separated string

                  setTable(
                    table.map((row) => {
                      if (row.App_Acronym === item.App_Acronym) {
                        row.App_permit_Done = event ? event.value : "";
                      }
                      return row;
                    })
                  )
                }
                isClearable={true}
                name="colors"
                options={groupOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                //read from app.group_list and match exactly
                value={groupOptions.find((option) => option.value === item.App_permit_Done)}
              />
            </TableCell>
            <TableCell align="center">
              <Button
                id={item.App_Acronym + "_button"}
                variant="outlined"
                onClick={(e) => handleSubmit(e, item)}
              >
                {item.editDisabled ? "Edit" : "Save"}
              </Button>
              <Button
                id={item.App_Acronym + "_button"}
                variant="outlined"
                onClick={() => Go(item.App_Acronym)}
              >
                Go
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Appbar title="Home" call={call} />
      <main>
        <Container maxWidth={false}>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ToastContainer
              position="top-right"
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
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">App*</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Rnum*</TableCell>
                  <TableCell align="center">Description*</TableCell>
                  <TableCell align="center">Create</TableCell>
                  <TableCell align="center">Open</TableCell>
                  <TableCell align="center">ToDo</TableCell>
                  <TableCell align="center">Doing</TableCell>
                  <TableCell align="center">Done</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <CreateRow />

                <Parent />
              </TableBody>
            </Table>
          </Box>
        </Container>
      </main>
    </ThemeProvider>
  );
}
