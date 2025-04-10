import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import handleActivateAccount from "../../Handles/handleActivateAccount";
import { showInfoToast, showErrorToast } from "../../Utils/ToastConfig/toastConfig"
import errorMessages from "../../Utils/constants/errorMessages";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";
import useLocaleStore from "../../Stores/useLocaleStore";
import { useIntl } from "react-intl";

export const Activate = () => {
  const activationToken = new URLSearchParams(useLocation().search).get("token");
  const navigate = useNavigate();
  //Confirmation Modal
  const [modalConfig, setModalConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  //Opções de língua
  const locale = useLocaleStore((state) => state.locale);
  const updateLocale = useLocaleStore((state) => state.updateLocale);
  const intl = useIntl();

  //Obter informação do utilizador autenticado e redirecionar caso não seja admin
  useEffect(() => {
        if (!activationToken) {
      navigate("/");
    }
    const activateUserAccount = async (activationToken) => {
      try {
        let response = await handleActivateAccount(activationToken);
        if (response.status === 200) {
          setModalConfig({
            title: intl.formatMessage({ id: "accountActivateActivatedTitle" }),
            message1: intl.formatMessage({ id: "accountActivateActivatedMessage1" }),
            message2: null,
            onConfirm: () => {
              setModalConfig({});
              setIsModalOpen(false);
              navigate("/");
            },
          });
          setIsModalOpen(true);
        } else if (response.status === 409) {
          const newToken = response.data.activationToken;
          const activationLink = "localhost:3000/activate/token?" + newToken;
          try{
          navigator.clipboard.writeText(activationLink);
          showInfoToast(
            intl.formatMessage({ id: "accountActivateInfoCopy" })
          );
          }
          catch(error){
            showInfoToast(
              intl.formatMessage({ id: "accountActivateInfoNotCopy" })
            );
          }
          
          setModalConfig({
            title: intl.formatMessage({ id: "accountActivateActivatedFailTitle" }),
            message1: intl.formatMessage({ id: "accountActivateActivatedFailMessage1" }),
            message2: "http://localhost:3000/activate?token=" + newToken,
            onConfirm: () => {
              setModalConfig({});
              setIsModalOpen(false);
              navigate("/");
            },
          });
          setIsModalOpen(true);
        }
      } catch (error) {
        const toastMessage =
          errorMessages[error.message] || errorMessages.unexpected_error;
        showErrorToast(toastMessage);
        navigate("/");
      }
    };
    activateUserAccount(activationToken);
  }, []);

  return (
    <ConfirmationModal
      title={modalConfig.title}
      message1={modalConfig.message1}
      message2={modalConfig.message2}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onConfirm={modalConfig.onConfirm}
    />
  );
};

export default Activate;
