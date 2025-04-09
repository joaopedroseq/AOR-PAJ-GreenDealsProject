import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import handleActivateAccount from "../../Handles/handleActivateAccount";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";
import errorMessages from "../Utils/constants/errorMessages";

export const Activate = () => {
  const activationToken = new URLSearchParams(useLocation().search).get("token");
  const navigate = useNavigate();
  //Confirmation Modal
  const [modalConfig, setModalConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Obter informação do utilizador autenticado e redirecionar caso não seja admin
  useEffect(() => {
    const activateUserAccount = async (activationToken) => {
      try {
        let response = await handleActivateAccount(activationToken);
        console.log(response);
        
      } catch (error) {
        console.log(error)
      }
    };
    activateUserAccount();
  }, []);
};

export default Activate;