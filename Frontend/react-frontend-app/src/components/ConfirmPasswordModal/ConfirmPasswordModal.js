import React from "react";
import "./confirmPasswordModal.css";
import { useIntl } from "react-intl";
import handleNotification from "../../Handles/handleNotification";
import { useForm } from "react-hook-form";
import { checkIfValidPassword } from "../../Utils/utilityFunctions";
import handleChangeUserInformation from "../../Handles/handleChangeUserInformation";
import useUserStore from "../../Stores/useUserStore";

const ConfirmPasswordModal = ({ userInfo, updatedUserInfo, isOpen, onClose }) => {
  const { register, handleSubmit, watch, reset } = useForm();
  const token = useUserStore((state) => state.token);
  const intl = useIntl(); // Initialize intl for translations

  const onSubmit = async (passwordData) => {
    const password = passwordData.password;

    try {
      await handleChangeUserInformation(userInfo, updatedUserInfo, password, token, false);
      handleNotification(intl, "success", "confirmPasswordModalSuccessMessage");
      reset();
      onClose();
    } catch (error) {
      handleNotification(intl, "error", `error${error.message}`);
    }
  };

  const onError = (errors) => {
    Object.keys(errors).forEach((errorKey) => {
      handleNotification(intl, "error", `confirmPasswordModalError${errorKey}`);
    });
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    isOpen && (
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
      </div>
    )
  );
};

export default ConfirmPasswordModal;