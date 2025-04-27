import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkIfValidPassword } from "../../Utils/utilityFunctions";
import handleNotification from "../../Handles/handleNotification";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { resetPassword } from "../../Api/authenticationApi";

export const PasswordReset = () => {
    const passwordResetToken = new URLSearchParams(useLocation().search).get(
        "token"
      );
       const { register, handleSubmit, watch } = useForm();
      const navigate = useNavigate();
      //Confirmation Modal
      const [modalConfig, setModalConfig] = useState({});
      const [isModalOpen, setIsModalOpen] = useState(false);
      //Opções de língua
      const intl = useIntl();

      const onSubmit = async (passwordData) => {
        const password = passwordData.password;
        try {
          const response = await resetPassword(passwordResetToken, password);
          if (response.data === "Password reset successful") {
            handleNotification(intl, "success", 'passwordResetConfirmTitleMessage');
          }
          navigate("/");
          handleNotification(intl, "success", 'passwordResetConfirmTitleMessage');
        } catch (error) {
          handleNotification(intl, "error", `passwordResetFailed`);
          navigate("/");
        }
      };
    
      const onError = (errors) => {
        Object.keys(errors).forEach((errorKey) => {
          handleNotification(intl, "error", `confirmPasswordModalError${errorKey}`);
        });
      };
    
      const handleCancel = () => {
        navigate("/");
      };

  
    return (
        <div id="modal-confirmPassword" className="modal-confirmPassword">
          <div className="modal-content-confirmPassword">
            <div className="modal-header-confirmPassword" id="modal-header-confirmPassword">
              <p className="modal-header-confirmPassword-title">
                {intl.formatMessage({ id: "confirmPasswordModalTitle" })}
              </p>
            </div>
            <div className="modal-body-confirmPassword">
              <form className="edit-confirmPassword-form" id="edit-confirmPassword-form" onSubmit={handleSubmit(onSubmit, onError)}>
                <div className="edit-confirmPassword-form-field" id="edit-confirmPassword-form-field">
                  <label htmlFor="password">{intl.formatMessage({ id: "confirmPasswordModalCurrentPassword" })}</label>
                  <input
                    type="password"
                    id="password"
                    maxLength="30"
                    {...register("password", {
                      required: intl.formatMessage({ id: "confirmPasswordModalErrorPasswordRequired" }),
                      validate: (value) =>
                        checkIfValidPassword(value) || intl.formatMessage({ id: "confirmPasswordModalErrorInvalidPassword" }),
                    })}
                  />
                </div>
  
                <div className="edit-confirmPassword-form-field" id="edit-confirmPassword-form-field">
                  <label htmlFor="passwordConfirm">{intl.formatMessage({ id: "confirmPasswordModalConfirmPassword" })}</label>
                  <input
                    type="password"
                    id="passwordConfirm"
                    maxLength="30"
                    {...register("passwordConfirm", {
                      required: intl.formatMessage({ id: "confirmPasswordModalErrorConfirmPasswordRequired" }),
                      validate: {
                        isValid: (value) =>
                          checkIfValidPassword(value) || intl.formatMessage({ id: "confirmPasswordModalErrorInvalidPassword" }),
                        isConfirmed: (value) =>
                          value === watch("password") || intl.formatMessage({ id: "confirmPasswordModalErrorPasswordMismatch" }),
                      },
                    })}
                  />
                </div>
  
                <div className="confirmPasswordButtons">
                  <input type="submit" className="submit" id="submit" value={intl.formatMessage({ id: "confirmPasswordModalConfirmButton" })} />
                  <button className="cancel" type="button" onClick={handleCancel}>
                    {intl.formatMessage({ id: "confirmPasswordModalCancelButton" })}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <ConfirmationModal
            title={modalConfig.title}
            message1={modalConfig.message1}
            message2={modalConfig.message2}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={modalConfig.onConfirm}
            />
        </div>
    
      )
};
  
  export default PasswordReset;