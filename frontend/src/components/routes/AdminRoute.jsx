import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getRoleHome, useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { role } = useAuth();
  if (role !== "admin") return <Navigate to={getRoleHome(role)} replace />;
  return <Outlet />;
};

export default AdminRoute;
