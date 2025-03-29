import React from "react";
import "./changePasswordModal.css";
import { showErrorToast } from "../../Utils/ToastConfig/toastConfig";
import { useForm } from "react-hook-form";
import { checkIfValidPassword } from "../../Utils/UtilityFunctions";
import handleChangeUserInformation from "../../Handles/handleChangeUserInformation";
import useUserStore from "../../stores/useUserStore";

const ChangePasswordModal = ({ userInfo, updatedUserInfo, isOpen, onClose }) => {
  const { register, handleSubmit, watch, reset } = useForm();
  const token = useUserStore((state) => state.token);

  const onSubmit = (passwordData) => {
    const oldPassword = passwordData.password;
    const newPassword = {
        password: passwordData.newPassword
    }
    handleChangeUserInformation(userInfo, newPassword, oldPassword, token);
    reset();
    onClose();
};

  const onError = (errors) => {
    if (errors.password) {
      showErrorToast(errors.password.message);
    }
    if (errors.passwordConfirm) {
      showErrorToast(errors.passwordConfirm.message);
    }
    if (errors.newPassword) {
        showErrorToast(errors.newPassword.message);
      }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };


  return (
    isOpen && (
    <div
      id="modal-changePassword"
      className="modal-changePassword"
    >
      {/*Conteúdo da janela modal*/}
      <div className="modal-content-changePassword">
        <div
          className="modal-header-changePassword"
          id="modal-header-changePassword"
        >
          <p className="modal-header-changePassword-title">
            Confirme a sua password
          </p>
        </div>
        <div className="modal-body-changePassword">
          {/*Formulário de edição de informações de um produto*/}
          <form
            className="edit-changePassword-form"
            id="edit-changePassword-form"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <div
              className="edit-changePassword-form-field"
              id="edit-changePassword-form-field"
            >
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                maxLength="30"
                {...register("password", {
                  required: "Para alterar a sua password, terá de preencher campos com a password antiga",
                  validate: (value) =>
                    checkIfValidPassword(value) ||
                    "A password não pode conter ' ou \"",
                })}
              />
            </div>
            <div
              className="edit-changePassword-form-field"
              id="edit-changePassword-form-field"
            >
              <label htmlFor="passwordConfirm">Confirmar Password:</label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                maxLength="30"
                {...register("passwordConfirm", {
                  required:
                    "Para alterar a sua password, terá de preencher campos com a password antiga",
                  validate: {
                    isValid: (value) =>
                      checkIfValidPassword(value) ||
                      "A password não pode conter ' ou \"",
                    isConfirmed: (value) =>
                      value === watch("password") ||
                      "As passwords não correspondem",
                  },
                })}
              />
              <div
              className="edit-changePassword-form-field"
              id="edit-changePassword-form-field"
            >
              <label htmlFor="newPassword">Nova Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                maxLength="30"
                {...register("newPassword", {
                  required:
                    "Para alterar a sua password, terá de preencher a sua nova password",
                  validate: {
                    isValid: (value) =>
                      checkIfValidPassword(value) ||
                      "A password não pode conter ' ou \"",
                    isConfirmed: (value) =>
                      value !== watch("password") ||
                      "A nova password é igual à antiga",
                  },
                })}
              />
              </div>
            </div>
            <div className="changePasswordButtons">
            <input
              type="submit"
              className="submit"
              id="submit"
              value="Confirmar"
            />
            <button className="cancel" type="button" onClick={handleCancel}>
              Cancelar
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