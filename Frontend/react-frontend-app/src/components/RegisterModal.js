import React, { useState } from "react";
import "../styles/registerModal.css";
import useRegister from '../hooks/useRegister';

function RegisterModal({ toggleModal, isModalVisible }) {
  const {
    setFirstName,
    setLastName,
    setNewUsername,
    setNewPassword,
    setPasswordConfirm,
    setEmail,
    setPhoneNumber,
    setUrl,
    handleRegister
  } = useRegister();



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
            onSubmit={handleRegister}
          >
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-nome">Primeiro Nome:</label>
              <input
                type="text"
                id="new-name"
                name="new-name"
                maxLength="20"
                onChange={(firstName) => setFirstName(firstName.target.value)}
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-apelido">Apelido:</label>
              <input
                type="text"
                id="new-lastname"
                name="new-lastname"
                maxLength="20"
                onChange={(lastName) => setLastName(lastName.target.value)}
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-username">Username:</label>
              <input
                type="text"
                id="new-username"
                name="new-username"
                maxLength="30"
                onChange={(username) => setNewUsername(username.target.value)}
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-password">Password:</label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                maxLength="30"
                onChange={(password) => setNewPassword(password.target.value)}
              />
            </div>
            <div className="edit-id-form-field" id="edit-product-form-field">
              <label htmlFor="edit-passwordConfirm">Confirmar Password:</label>
              <input
                type="password"
                id="new-passwordConfirm"
                name="new-passwordConfirm"
                maxLength="30"
                onChange={(passwordConfirm) =>
                  setPasswordConfirm(passwordConfirm.target.value)
                }
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-email">Email:</label>
              <input
                type="text"
                id="new-email"
                name="new-email"
                maxLength="40"
                onChange={(email) => setEmail(email.target.value)}
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-phone">Número de Telefone:</label>
              <input
                type="text"
                id="new-phone"
                name="new-phone"
                maxLength="20"
                onChange={(phoneNumber) =>
                  setPhoneNumber(phoneNumber.target.value)
                }
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-photo">Fotografia de Perfil (URL):</label>
              <input
                type="url"
                id="new-photo"
                name="new-photo"
                placeholder="URL da imagem"
                onChange={(url) => setUrl(url.target.value)}
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