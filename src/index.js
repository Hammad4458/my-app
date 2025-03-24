import React from "react";
import ReactDOM from "react-dom/client";
import { Login } from "./pages/login/index";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { PublicRoute } from "./routes/publicRoutes";
import { PrivateRoute } from "./routes/protectedRoutes/index";
import { UserProvider } from "./components/context/index";
import 'antd/dist/reset.css'; 
import {UserDashboard} from "../src/pages/user-dashboard/index"
import { Tasks } from "./pages/tasks";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <CookiesProvider>
      <UserProvider>
        <Routes>
          <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/users/:userId/tasks" element={<Tasks />} />
            <Route path="/dashboard/tasks" element={<Tasks />} />
          </Route>
        </Routes>
      </UserProvider>
    </CookiesProvider>
  </BrowserRouter>
);

reportWebVitals();
