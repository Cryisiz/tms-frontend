import Login from "./Login.js";
import Home from "./Home.js";
import { Routes, Route } from "react-router-dom";
import MyAccount from "./MyAccount.js";
import AccountManagement from "./AccountManagement.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/myaccount" element={<MyAccount />} />
      <Route path="/accountmanagement" element={<AccountManagement />} />
    </Routes>
  );
}

export default App;
