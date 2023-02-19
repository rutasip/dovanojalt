import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({
  isAllowed,
  redirectPath,
  children,
}) {
  if (!isAllowed) {
    // TODO show login modal when not logged in
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
