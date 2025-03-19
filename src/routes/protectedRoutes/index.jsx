import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export const PrivateRoute = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(Cookies.get("token"));
  }, []);

  if (token === null) return null; // Prevent flashing

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};