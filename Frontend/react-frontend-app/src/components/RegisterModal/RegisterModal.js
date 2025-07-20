import { React, useState } from "react";
import "./registerModal.css";

import { registerUser } from "../../Api/authenticationApi";
import {
  checkIfValidName,
  checkIfValidUsername,
  checkIfValidPassword,
} from "../../Utils/utilityFunctions";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import handleNotification from "../../Handles/handleNotification";

const RegisterModal = ({ toggleModal, isModalVisible, locale }) => {
  //Modal de Registo de novo utilizador
  const { register, handleSubmit, watch, reset } = useForm();
  //Confirmation Modal
  const [modalConfig, setModalConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);


  const intl = useIntl();

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]); // Store the selected file
  };
  

  //Submissão do formulário (admin é sempre falso)
  const onSubmit = async (registerData) => {
    const newUser = {
      username: registerData.username,
      password: registerData.password,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      phoneNumber: registerData.phoneNumber,
      url: registerData.username,
    };

    try {
      const formData = new FormData();
    formData.append("profileImage", selectedFile);
    formData.append("username", registerData.username); // Send the username


  try {
    const response = await fetch("https://localhost:8443/sequeira-proj5/rest/auth/photo", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("Profile image uploaded successfully!");
    } else {
      console.error("Upload failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }

      const activationToken = await registerUser(newUser);
      const activationLink = `localhost:3000/activate?token=${activationToken}`;
      navigator.clipboard.writeText(activationLink);

      handleNotification(intl, "success", "registerModalSuccessMessage", {
        firstName: newUser.firstName,
      });

      handleNotification(intl, "info", "registerModalActivationLinkCopied");

      reset();
      setModalConfig({
        title: intl.formatMessage({ id: "registerModalActivationTokenTitle" }),
        message1: intl.formatMessage({
          id: "registerModalActivationInstruction",
        }),
        message2: activationLink,
        onConfirm: () => {
          setModalConfig({});
          setIsModalOpen(false);
          toggleModal();
        },
      });

      setIsModalOpen(true);
    } catch (error) {
      handleNotification(
        intl,
        "error",
        `error${error.message}`,
        {},
        intl.formatMessage({ id: "errorUnexpected" })
      );
      reset();
      toggleModal();
    }
  };

  // Apresentação de erros ao utilizador
  const onError = (errors) => {
    Object.entries(errors).forEach(([errorKey, errorValue]) => {
      handleNotification(intl, "error", errorValue.message);
    });
  };

  return (
    isModalVisible && (
      <div id="modal-register" className="modal-register">
        <div className="modal-content-id">
          {/* Header do modal */}
          <div className="modal-header-id" id="modal-header-id">
            <p className="modal-header-id-title">
              {intl.formatMessage({ id: "registerModalTitle" })}
            </p>
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
                <label htmlFor="edit-nome">
                  {intl.formatMessage({ id: "registerModalFirstNameLabel" })}
                </label>
                <input
                  type="text"
                  id="new-name"
                  name="new-name"
                  placeholder={intl.formatMessage({
                    id: "registerModalFirstNamePlaceholder",
                  })}
                  maxLength="20"
                  {...register("firstName", {
                    required: "registerModalErrorfirstName",
                    validate: (value) =>
                      checkIfValidName(value) ||
                      "registerModalErrorInvalidName",
                  })}
                />
              </div>
              <div className="edit-id-form-field" id="edit-id-form-field">
                <label htmlFor="edit-apelido">
                  {intl.formatMessage({ id: "registerModalLastNameLabel" })}
                </label>
                <input
                  type="text"
                  id="new-lastname"
                  name="new-lastname"
                  placeholder={intl.formatMessage({
                    id: "registerModalLastNamePlaceholder",
                  })}
                  maxLength="20"
                  {...register("lastName", {
                    required: "registerModalErrorlastName",
                    validate: (value) =>
                      checkIfValidName(value) ||
                      "registerModalErrorInvalidName",
                  })}
                />
              </div>
              <div className="edit-id-form-field" id="edit-id-form-field">
                <label htmlFor="edit-username">
                  {intl.formatMessage({ id: "registerModalUsernameLabel" })}
                </label>
                <input
                  type="text"
                  id="new-username"
                  name="new-username"
                  placeholder={intl.formatMessage({
                    id: "registerModalUsernamePlaceholder",
                  })}
                  maxLength="30"
                  {...register("username", {
                    required: "registerModalErrorusername",
                    validate: (value) =>
                      checkIfValidUsername(value) ||
                      "registerModalErrorInvalidUsername",
                  })}
                />
              </div>
              <div className="edit-id-form-field" id="edit-id-form-field">
                <label htmlFor="edit-password">
                  {intl.formatMessage({ id: "registerModalPasswordLabel" })}
                </label>
                <input
                  type="password"
                  id="new-password"
                  name="new-password"
                  placeholder={intl.formatMessage({
                    id: "registerModalPasswordPlaceholder",
                  })}
                  maxLength="30"
                  autoComplete="new-password"
                  {...register("password", {
                    required: "registerModalErrorpassword",
                    validate: (value) =>
                      checkIfValidPassword(value) ||
                      "registerModalErrorInvalidPassword",
                  })}
                />
              </div>
              <div className="edit-id-form-field" id="edit-id-form-field">
                <label htmlFor="edit-passwordConfirm">
                  {intl.formatMessage({
                    id: "registerModalConfirmPasswordLabel",
                  })}
                </label>
                <input
                  type="password"
                  id="new-passwordConfirm"
                  name="new-passwordConfirm"
                  placeholder={intl.formatMessage({
                    id: "registerModalConfirmPasswordPlaceholder",
                  })}
                  maxLength="30"
                  autoComplete="new-password"
                  {...register("passwordConfirm", {
                    required: "registerModalErrorpasswordConfirm",
                    validate: {
                      isValid: (value) =>
                        checkIfValidPassword(value) ||
                        "registerModalErrorInvalidPassword",
                      isConfirmed: (value) =>
                        value === watch("password") ||
                        "registerModalErrorPasswordMismatch",
                    },
                  })}
                />
              </div>
              <div className="edit-id-form-field" id="edit-id-form-field">
                <label htmlFor="edit-email">
                  {intl.formatMessage({ id: "registerModalEmailLabel" })}
                </label>
                <input
                  type="text"
                  id="new-email"
                  name="new-email"
                  placeholder={intl.formatMessage({
                    id: "registerModalEmailPlaceholder",
                  })}
                  maxLength="40"
                  {...register("email", {
                    required: "registerModalErroremail",
                    validate: (value) =>
                      value.includes("@") || "registerModalErrorInvalidEmail",
                  })}
                />
              </div>
              <div className="edit-id-form-field" id="edit-id-form-field">
                <label htmlFor="edit-phone">
                  {intl.formatMessage({ id: "registerModalPhoneLabel" })}
                </label>
                <input
                  type="text"
                  id="new-phone"
                  name="new-phone"
                  placeholder={intl.formatMessage({
                    id: "registerModalPhonePlaceholder",
                  })}
                  maxLength="20"
                  {...register("phoneNumber", {
                    required: "registerModalErrorphoneNumber",
                    validate: (value) =>
                      /^\d{9}$/.test(value) || "registerModalErrorInvalidPhone",
                  })}
                />
              </div>
              <div className="edit-id-form-field" id="edit-id-form-field">
                <label htmlFor="edit-photo">
                  {intl.formatMessage({ id: "registerModalPhotoUrlLabel" })}
                </label>
                <input
  type="file"
  id="new-photo"
  name="new-photo"
  accept="image/*"
  onChange={(e) => handleFileUpload(e)}
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
