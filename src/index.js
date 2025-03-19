import React from "react";
import ReactDOM from "react-dom/client";
import { Login } from "./pages/login/index";
import { Dashboard } from "./pages/dashboard/index";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { PublicRoute } from "./routes/publicRoutes";
import { PrivateRoute } from "./routes/protectedRoutes/index";
import { UserProvider } from "./components/context/index";
import "./index.css";
import { Tasks } from "./pages/tasks";

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/users/:userId/tasks" element={<Tasks />} />
          </Route>
        </Routes>
      </UserProvider>
    </CookiesProvider>
  </BrowserRouter>
);

reportWebVitals();
