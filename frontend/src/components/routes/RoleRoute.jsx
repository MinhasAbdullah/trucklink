import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getRoleHome, useAuth } from "../../context/AuthContext";

const RoleRoute = ({ allowedRole }) => {
  const { role } = useAuth();
  if (role !== allowedRole) return <Navigate to={getRoleHome(role)} replace />;
  return <Outlet />;
};

export default RoleRoute;
