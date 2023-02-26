/* eslint-disable no-nested-ternary */
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import LoadingSpinner from "../components/shared/LoadingSpinner";

function ProtectedRoute({ component: Component }) {
  const { userData } = useContext(UserContext);

  return userData.loading ? (
    <LoadingSpinner className="centered-on-page-spinner" />
  ) : userData.user ? (
    <Component/>
  ) : (
    <Navigate to={{ pathname: "/" }} />
  );
}

export default ProtectedRoute;
