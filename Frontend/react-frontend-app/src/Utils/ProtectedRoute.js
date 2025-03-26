import React from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../stores/useUserStore";
import { showInfoToast } from "./ToastConfig/toastConfig";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUserStore((state) => state);

  if (!isAuthenticated) {
    showInfoToast('Para visualizar produtos, registe-se e/ou faça login.');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;