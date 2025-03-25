import React from "react";
import "./confirmPasswordModal.css";
import { showErrorToast } from "../../Utils/ToastConfig/toastConfig";
import { useForm } from "react-hook-form";
import { checkIfValidPassword } from "../../Utils/UtilityFunctions";
import handleChangeUserInformation from "../../hooks/handleChangeUserInformation";
import userStore from "../../stores/UserStore";

const ConfirmPasswordModal = ({ userInfo, updatedUserInfo, isOpen, onClose }) => {
  const { register, handleSubmit, watch, reset } = useForm();
  const token = userStore((state) => state.token);

  const onSubmit = (passwordData) => {
    const password = passwordData.password;
    handleChangeUserInformation(userInfo, updatedUserInfo, password, token);
    reset();
    onClose();
};

  const onError = (errors) => {
    console.log("ran");
    if (errors.password) {
      showErrorToast(errors.password.message);
    }
    if (errors.passwordConfirm) {
      showErrorToast(errors.passwordConfirm.message);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };


  return (
    <div
      id="modal-confirmPassword"
      className="modal-confirmPassword"
      style={{ display: isOpen ? "flex" : "none" }}
    >
      {/*Conteúdo da janela modal*/}
      <div className="modal-content-confirmPassword">
        <div
          className="modal-header-confirmPassword"
          id="modal-header-confirmPassword"
        >
          <p className="modal-header-confirmPassword-title">
            Confirme a sua password
          </p>
        </div>
        <div className="modal-body-confirmPassword">
          {/*Formulário de edição de informações de um produto*/}
          <form
            className="edit-confirmPassword-form"
            id="edit-confirmPassword-form"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <div
              className="edit-confirmPassword-form-field"
              id="edit-confirmPassword-form-field"
            >
              <label htmlFor="edit-password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                maxLength="30"
                {...register("password", {
                  required: "Para alterar informações de utilizador, terá de preencher a password",
                  validate: (value) =>
                    checkIfValidPassword(value) ||
                    "A password não pode conter ' ou \"",
                })}
              />
            </div>
            <div
              className="edit-confirmPassword-form-field"
              id="edit-confirmPassword-form-field"
            >
              <label htmlFor="edit-passwordConfirm">Confirmar Password:</label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                maxLength="30"
                {...register("passwordConfirm", {
                  required:
                    "Para alterar informações de utilizador, terá de preencher a confirmação da password",
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
            </div>
            <input
              type="submit"
              className="submit"
              id="submit"
              value="Confirmar"
            />
            <button className="cancel" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPasswordModal;