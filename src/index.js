import React from "react";
import ReactDOM from "react-dom/client";
import { Login } from "./pages/login/index";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { PublicRoute } from "./routes/publicRoutes";
import { PrivateRoute } from "./routes/protectedRoutes/index";
import { UserProvider } from "./components/context/index";
import { SuperAdminDashboard } from "./pages/super-admin/dashboard";
import 'antd/dist/reset.css'; // For Ant Design v5
import "./index.css";
import {Dashboard} from "../src/pages/user-dashboard/index"
import { Tasks } from "./pages/tasks";
import { Organizations } from "./pages/super-admin/organization";
import { Departments } from "./pages/super-admin/department";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <CookiesProvider>
      <UserProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<PrivateRoute />}>
          <Route path="/superAdmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superAdmin/organization" element={<Organizations />} />
          <Route path="/superAdmin/department" element={<Departments />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/users/:userId/tasks" element={<Tasks />} />
          </Route>
        </Routes>
      </UserProvider>
    </CookiesProvider>
  </BrowserRouter>
);

reportWebVitals();
