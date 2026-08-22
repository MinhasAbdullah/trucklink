import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getRoleHome, useAuth } from "../../context/AuthContext";

const PublicRoute = () => {
  const { isAuthenticated, role, initializing } = useAuth();
  if (initializing) return null;
  return isAuthenticated ? <Navigate to={getRoleHome(role)} replace /> : <Outlet />;
};

export default PublicRoute;
