import React from "react";
import { Navigate } from "react-router-dom";
import userStore from "../stores/userStore";
import { showInfoToast } from "./ToastConfig/toastConfig";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = userStore((state) => state);

  if (!isAuthenticated) {
    showInfoToast('Para visualizar produtos, registe-se e/ou faça login.');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;