import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute(props) {
  const { children, toNavigate, type } = props;
  const { isLoggedIn, isCustomer } = props.auth;
  if (type === "customer") {
    if (isLoggedIn && isCustomer) return children;
  }
  if (type === "tiffin-vendor") {
    if (isLoggedIn && !isCustomer) return children;
  }
  return <Navigate to={toNavigate} replace />;
}

export default ProtectedRoute;
