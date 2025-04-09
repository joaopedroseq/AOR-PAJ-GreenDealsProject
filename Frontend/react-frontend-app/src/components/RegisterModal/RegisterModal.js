import { React, useState } from "react";
import "./registerModal.css";

import { registerUser } from "../../Api/authenticationApi";
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
import errorMessages from "../../Utils/constants/errorMessages";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const RegisterModal = ({ toggleModal, isModalVisible }) => {
  //Modal de Registo de novo utilizador
  const { register, handleSubmit, watch, reset } = useForm();
  //Confirmation Modal
  const [modalConfig, setModalConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Submissão do formulário (admin é sempre falso)
  const onSubmit = async (registerData) => {
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
      const activationToken = await registerUser(newUser);
      showSuccessToast(
        "Novo registo com sucesso " +
          newUser.firstName +
          " falta apenas ativar a sua conta"
      );
      reset();
      setModalConfig({
        title: "Token de ativação de conta",
        message1: `Utilize o endereço abaixo para ativar a sua conta`,
        message2: "localhost:3000/activate/token?" + activationToken,
        onConfirm: () => {
          setModalConfig({})
          setIsModalOpen(false);
          toggleModal();
        },
      });
      setIsModalOpen(true);
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
      reset();
      toggleModal();
    }
  };

  // Apresentação de erros ao utilizador
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
    isModalVisible && (
      <div id="modal-register" className="modal-register">
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
                <label htmlFor="edit-nome">Primeiro Nome: </label>
                <input
                  type="text"
                  id="new-name"
                  name="new-name"
                  placeholder="nome"
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
                <label htmlFor="edit-apelido">Apelido: </label>
                <input
                  type="text"
                  id="new-lastname"
                  name="new-lastname"
                  placeholder="apelido"
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
                <label htmlFor="edit-username">Username: </label>
                <input
                  type="text"
                  id="new-username"
                  name="new-username"
                  placeholder="username"
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
                <label htmlFor="edit-password">Password: </label>
                <input
                  type="password"
                  id="new-password"
                  name="new-password"
                  placeholder="password"
                  maxLength="30"
                  {...register("password", {
                    required: "Para se registar terá de preencher a password",
                    validate: (value) =>
                      checkIfValidPassword(value) ||
                      "A password não pode conter ' ou \"",
                  })}
                />
              </div>
              <div className="edit-id-form-field" id="edit-id-form-field">
                <label htmlFor="edit-passwordConfirm">
                  Confirmar Password:{" "}
                </label>
                <input
                  type="password"
                  id="new-passwordConfirm"
                  name="new-passwordConfirm"
                  placeholder="password"
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
                <label htmlFor="edit-email">Email: </label>
                <input
                  type="text"
                  id="new-email"
                  name="new-email"
                  placeholder="email"
                  maxLength="40"
                  {...register("email", {
                    required: "Para se registar terá de preencher o seu email",
                    validate: (value) =>
                      value.includes("@") || "O seu email tem de conter um @",
                  })}
                />
              </div>
              <div className="edit-id-form-field" id="edit-id-form-field">
                <label htmlFor="edit-phone">Número de Telefone: </label>
                <input
                  type="text"
                  id="new-phone"
                  name="new-phone"
                  placeholder="contacto telefónico"
                  maxLength="20"
                  {...register("phoneNumber", {
                    required:
                      "Para se registar terá de preencher o seu contacto telefónico",
                    validate: (value) =>
                      /^\d{9}$/.test(value) ||
                      "O seu número de telefone tem de conter pelo menos 9 digitos",
                  })}
                />
              </div>
              <div className="edit-id-form-field" id="edit-id-form-field">
                <label htmlFor="edit-photo">Fotografia de Perfil (URL): </label>
                <input
                  type="text"
                  id="new-photo"
                  name="new-photo"
                  placeholder="url de imagem"
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
  );
};

export default RegisterModal;
