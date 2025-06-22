import React from "react";
import { Navigate } from "react-router-dom";

// пример простой авторизации из localStorage
const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

export default function PrivateRoute({ element }) {
  const isAuthenticated = !!localStorage.getItem("kpt") && 
  !!localStorage.getItem("email") &&
  !!localStorage.getItem("firstName");
  return isAuthenticated ? element : <Navigate to="/authentication/sign-in" />;
}