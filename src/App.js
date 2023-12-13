import Login from "./Login.js";
import Home from "./Home.js";
import { Routes, Route } from "react-router-dom";
import MyAccount from "./MyAccount.js";
import AccountManagement from "./AccountManagement.js";
import * as React from "react";
import Plan from "./Plan.js";
import Kanban from "./Kanban.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/myaccount" element={<MyAccount />} />
      <Route path="/accountmanagement" element={<AccountManagement />} />
      <Route path="/kanban" element={<Kanban />} />
      <Route path="/plan" element={<Plan />} />
    </Routes>
  );
}

export default App;
