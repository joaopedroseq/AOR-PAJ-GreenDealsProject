import React from "react";
import "./registerModal.css";
import { registerUser } from "../../api/userApi";
import {
  checkIfValidName,
  checkIfValidUsername,
  checkIfValidPassword,
} from "../../Utils/utilityFunctions";
import { useForm } from "react-hook-form";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastConfig/toastConfig";
import { handleLogin } from "../../hooks/handleLogin";
import userStore from '../../stores/userStore';
import toggleRegisterModal from '../../components/Header/Header';

function RegisterModal({ toggleModal, isModalVisible }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const updateUsername = userStore((state) => state.updateUsername);
    const updateToken = userStore((state) => state.updateToken);
    const updateIsAuthenticated = userStore((state) => state.updateIsAuthenticated);
    const updateIsAdmin = userStore((state) => state.updateIsAdmin);
    const updateUrlPhoto = userStore((state) => state.updateUrlPhoto);
    const updateFirstName = userStore((state) => state.updateFirstName);
  
    const userStoreUpdates = {
      updateUsername,
      updateToken,
      updateIsAuthenticated,
      updateIsAdmin,
      updateUrlPhoto,
      updateFirstName,
    };

  const onSubmit = async(registerData) => {
    const newUser = {
      username: registerData.username,
      password: registerData.password,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      phoneNumber: registerData.phoneNumber,
      url: registerData.urlPhoto,
    };
    try {
      if(await registerUser(newUser)){
        showSuccessToast('Novo registo com sucesso. Ben-vindo ' + newUser.firstName)
        try {
          await handleLogin(newUser, userStoreUpdates);
          toggleModal();
        } catch (error) {
          showErrorToast("Falha no login automático após registo. Tente fazer login manualmente.");
          return;
        }
      }
    }
    catch (error) {
      if(error.message === 'invalid_data'){
        showErrorToast('dados inválidos');
        return;
      }
      if(error.message === 'same_username'){
        showErrorToast('Já existe um usuário com este nome de utilizador.');
        return;
      }
      showErrorToast('Registo falhou. Tente novamente');
      return;
    }
}

  // Handle validation errors
  const onError = (errors) => {
    if (errors.firstName) {
      showErrorToast(errors.firstName.message);
    }
    if (errors.lastName) {
      showErrorToast(errors.lastName.message);
    }
    if (errors.username) {
      showErrorToast(errors.username.message);
    }
    if (errors.password) {
      showErrorToast(errors.password.message);
    }
    if (errors.passwordConfirm) {
      showErrorToast(errors.passwordConfirm.message);
    }
    if (errors.email) {
      showErrorToast(errors.email.message);
    }
    if (errors.phoneNumber) {
      showErrorToast(errors.phoneNumber.message);
    }
    if (errors.urlPhoto) {
      showErrorToast(errors.urlPhoto.message);
    }
  };

  return (
    <div
      id="modal-register"
      className="modal-register"
      style={{ display: isModalVisible ? "flex" : "none" }}
    >
      <div className="modal-content-id">
        {/* Header do modal */}
        <div className="modal-header-id" id="modal-header-id">
          <p className="modal-header-id-title">Criar novo registo</p>
          <p className="close-id" id="close-id" onClick={toggleModal}>
            &times;
          </p>
        </div>
        {/* Body do modal */}
        <div className="modal-body-id">
          <form
            className="edit-id-form"
            id="edit-id-form"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-nome">Primeiro Nome:</label>
              <input
                type="text"
                id="new-name"
                name="new-name"
                maxLength="20"
                {...register("firstName", {
                  required:
                    "Para se registar terá de preencher o primeiro nome",
                  validate: (value) =>
                    checkIfValidName(value) ||
                    "O primeiro nome não deverá conter caracteres especiais",
                })}
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-apelido">Apelido:</label>
              <input
                type="text"
                id="new-lastname"
                name="new-lastname"
                maxLength="20"
                {...register("lastName", {
                  required: "Para se registar terá de preencher o apelido",
                  validate: (value) =>
                    checkIfValidName(value) ||
                    "O apelido nome não deverá conter caracteres especiais",
                })}
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-username">Username:</label>
              <input
                type="text"
                id="new-username"
                name="new-username"
                maxLength="30"
                {...register("username", {
                  required:
                    "Para se registar terá de preencher o nome de utilizador",
                  validate: (value) =>
                    checkIfValidUsername(value) ||
                    "O nome de utilizador pode conter - e _ mas não outros caracteres especiais",
                })}
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-password">Password:</label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                maxLength="30"
                {...register("password", {
                  required: "Para se registar terá de preencher a password",
                  validate: (value) =>
                    checkIfValidPassword(value) ||
                    "A password não pode conter ' ou \"",
                })}
              />
            </div>
            <div className="edit-id-form-field" id="edit-product-form-field">
              <label htmlFor="edit-passwordConfirm">Confirmar Password:</label>
              <input
                type="password"
                id="new-passwordConfirm"
                name="new-passwordConfirm"
                maxLength="30"
                {...register("passwordConfirm", {
                  required:
                    "Para se registar terá de preencher a confirmação da password",
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
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-email">Email:</label>
              <input
                type="text"
                id="new-email"
                name="new-email"
                maxLength="40"
                {...register("email", {
                  required: "Para se registar terá de preencher o seu email",
                  validate: (value) =>
                    value.includes("@") || "O seu email tem de conter um @",
                })}
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-phone">Número de Telefone:</label>
              <input
                type="text"
                id="new-phone"
                name="new-phone"
                maxLength="20"
                {...register("phoneNumber", {
                  required:
                    "Para se registar terá de preencher o seu contacto telefónico",
                  validate: (value) =>
                    (/^\d{9}$/.test(value)) ||
                    "O seu número de telefone tem de conter pelo menos 9 digitos",
                })}
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-photo">Fotografia de Perfil (URL):</label>
              <input
                type="url"
                id="new-photo"
                name="new-photo"
                placeholder="URL da imagem"
                {...register("urlPhoto", {
                  required:
                    "Para se registar terá de preencher com o url da sua fotografia de perfil",
                })}
              />
            </div>
            <input
              type="submit"
              id="registerBtn"
              className="registerBtn"
              value="Register"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
