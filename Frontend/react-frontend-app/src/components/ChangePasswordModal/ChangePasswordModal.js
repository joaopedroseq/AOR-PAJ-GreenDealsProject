import React from "react";
import "./changePasswordModal.css";
import { useIntl } from "react-intl";
import { showErrorToast } from "../../Utils/ToastConfig/toastConfig";
import { useForm } from "react-hook-form";
import { checkIfValidPassword } from "../../Utils/utilityFunctions.js";
import handleChangeUserInformation from "../../Handles/handleChangeUserInformation";
import useUserStore from "../../Stores/useUserStore.js";
import handleNotification from "../../Handles/handleNotification.js";

const ChangePasswordModal = ({ userInfo, updatedUserInfo, isOpen, onClose}) => {
  const { register, handleSubmit, watch, reset } = useForm();
  const token = useUserStore((state) => state.token);
  const intl = useIntl(); // Initialize intl for translations

  const onSubmit = async (passwordData) => {
    const oldPassword = passwordData.password;
    const newPassword = { password: passwordData.newPassword };
  
    try {
      await handleChangeUserInformation(userInfo, newPassword, oldPassword, token);
      handleNotification(intl, "success", "changePasswordModalSuccessMessage");
      reset();
      onClose();
    } catch (error) {
      handleNotification(intl, "error", `error${error.message}`);
    }
  };

  const onError = (errors) => {
    Object.keys(errors).forEach((errorKey) => {
      handleNotification(intl, "error", `changePasswordModalError${errorKey}`);
    });
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    isOpen && (
      <div id="modal-changePassword" className="modal-changePassword">
        <div className="modal-content-changePassword">
          <div className="modal-header-changePassword" id="modal-header-changePassword">
            <p className="modal-header-changePassword-title">
              {intl.formatMessage({ id: "changePasswordModalTitle" })}
            </p>
          </div>
          <div className="modal-body-changePassword">
            <form className="edit-changePassword-form" id="edit-changePassword-form" onSubmit={handleSubmit(onSubmit, onError)}>
              <div className="edit-changePassword-form-field" id="edit-changePassword-form-field">
                <label htmlFor="password">{intl.formatMessage({ id: "changePasswordModalCurrentPassword" })}</label>
                <input
                  type="password"
                  id="password"
                  maxLength="30"
                  {...register("password", {
                    required: intl.formatMessage({ id: "changePasswordModalErrorOldPasswordRequired" }),
                    validate: (value) =>
                      checkIfValidPassword(value) || intl.formatMessage({ id: "changePasswordModalErrorInvalidPassword" }),
                  })}
                />
              </div>

              <div className="edit-changePassword-form-field" id="edit-changePassword-form-field">
                <label htmlFor="passwordConfirm">{intl.formatMessage({ id: "changePasswordModalConfirmPassword" })}</label>
                <input
                  type="password"
                  id="passwordConfirm"
                  maxLength="30"
                  {...register("passwordConfirm", {
                    required: intl.formatMessage({ id: "changePasswordModalErrorOldPasswordRequired" }),
                    validate: {
                      isValid: (value) =>
                        checkIfValidPassword(value) || intl.formatMessage({ id: "changePasswordModalErrorInvalidPassword" }),
                      isConfirmed: (value) =>
                        value === watch("password") || intl.formatMessage({ id: "changePasswordModalErrorPasswordMismatch" }),
                    },
                  })}
                />
              </div>

              <div className="edit-changePassword-form-field" id="edit-changePassword-form-field">
                <label htmlFor="newPassword">{intl.formatMessage({ id: "changePasswordModalNewPassword" })}</label>
                <input
                  type="password"
                  id="newPassword"
                  maxLength="30"
                  {...register("newPassword", {
                    required: intl.formatMessage({ id: "changePasswordModalErrorNewPasswordRequired" }),
                    validate: {
                      isValid: (value) =>
                        checkIfValidPassword(value) || intl.formatMessage({ id: "changePasswordModalErrorInvalidPassword" }),
                      isConfirmed: (value) =>
                        value !== watch("password") || intl.formatMessage({ id: "changePasswordModalErrorSamePassword" }),
                    },
                  })}
                />
              </div>
              <div className="changePasswordButtons">
                <input type="submit" className="submit" id="submit" value={intl.formatMessage({ id: "changePasswordModalConfirmButton" })} />
                <button className="cancel" type="button" onClick={handleCancel}>
                  {intl.formatMessage({ id: "changePasswordModalCancelButton" })}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default ChangePasswordModal;