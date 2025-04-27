import React from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../Stores/useUserStore";
import { showInfoToast } from "./ToastConfig/toastConfig";
import { useIntl } from "react-intl";
import handleNotification from "../Handles/handleNotification";

//Proteção de acesso sem autenticação
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useUserStore((state) => state);
  const intl = useIntl();

  if (!isAuthenticated) {
    handleNotification(intl, "info", "protectedRoute");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;