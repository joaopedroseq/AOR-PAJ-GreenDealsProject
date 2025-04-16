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
    Object.keys(errors).forEach((errorKey) => {
      handleNotification(intl, "error", `registerModalError${errorKey}`);
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
              {[
                {
                  id: "firstName",
                  label: "registerModalFirstNameLabel",
                  placeholder: "registerModalFirstNamePlaceholder",
                  maxLength: 20,
                  validation: checkIfValidName,
                },
                {
                  id: "lastName",
                  label: "registerModalLastNameLabel",
                  placeholder: "registerModalLastNamePlaceholder",
                  maxLength: 20,
                  validation: checkIfValidName,
                },
                {
                  id: "username",
                  label: "registerModalUsernameLabel",
                  placeholder: "registerModalUsernamePlaceholder",
                  maxLength: 30,
                  validation: checkIfValidUsername,
                },
                {
                  id: "email",
                  label: "registerModalEmailLabel",
                  placeholder: "registerModalEmailPlaceholder",
                  maxLength: 40,
                  validation: (val) => val.includes("@"),
                },
                {
                  id: "phoneNumber",
                  label: "registerModalPhoneLabel",
                  placeholder: "registerModalPhonePlaceholder",
                  maxLength: 20,
                  validation: (val) => /^\d{9}$/.test(val),
                },
                {
                  id: "urlPhoto",
                  label: "registerModalPhotoUrlLabel",
                  placeholder: "registerModalPhotoUrlPlaceholder",
                },
                {
                  id: "password",
                  label: "registerModalPasswordLabel",
                  placeholder: "registerModalPasswordPlaceholder",
                  maxLength: 30,
                  validation: checkIfValidPassword,
                  type: "password",
                  autoComplete: "new-password",
                }
              ].map(({ id, label, placeholder, maxLength, validation }) => (
                <div className="edit-id-form-field" key={id}>
                  <label htmlFor={id}>
                    {intl.formatMessage({ id: label })}
                  </label>
                  <input
                    type={id === "password" ? "password" : "text"} // Ensures correct input type
                    id={`new-${id}`}
                    name={`new-${id}`}
                    placeholder={intl.formatMessage({ id: placeholder })}
                    autoComplete={id === "password" ? "new-password" : "off"}
                    maxLength={maxLength}
                    {...register(id, {
                      required: intl.formatMessage({
                        id: `registerModalError${id}Required`,
                      }),
                      validate: validation
                        ? (value) =>
                            validation(value) ||
                            intl.formatMessage({
                              id: `registerModalErrorInvalid${id}`,
                            })
                        : undefined,
                    })}
                  />
                </div>
              ))}

              {/* Password Confirmation */}
              <div className="edit-id-form-field">
                <label htmlFor="passwordConfirm">
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
                    required: intl.formatMessage({
                      id: "registerModalErrorConfirmPasswordRequired",
                    }),
                    validate: {
                      isValid: (value) =>
                        checkIfValidPassword(value) ||
                        intl.formatMessage({
                          id: "registerModalErrorInvalidPassword",
                        }),
                      isConfirmed: (value) =>
                        value === watch("password") ||
                        intl.formatMessage({
                          id: "registerModalErrorPasswordMismatch",
                        }),
                    },
                  })}
                />
              </div>

              <input
                type="submit"
                id="registerBtn"
                className="registerBtn"
                value={intl.formatMessage({ id: "registerModalSubmitButton" })}
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
