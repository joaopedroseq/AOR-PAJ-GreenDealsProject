import React, { useState } from "react";
import "../styles/registerModal.css";
import { checkIfValid } from "../utils";
import { registerUser } from "../services/userService";
import { login } from "../services/authenticationService";
import { getUserInformation } from "../services/userService";

function RegisterModal({ toggleModal, isModalVisible }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newUsername, setUsername] = useState("");
  const [newPassword, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [url, setUrl] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    if (firstName.trim() === "") {
      alert("O primeiro nome é um campo de preenchimento obrigatório");
    } else if (lastName.trim() === "") {
      alert("O apelido é obrigatório.");
    } else if (newUsername.trim() === "") {
      alert("O username é de preenchimento obrigatório");
    } else if (!checkIfValid(newUsername)) {
      alert("O username não pode conter espaços nem caractéres especiais");
    } else if (newPassword.trim() === "") {
      alert("A password é de preenchimento obrigatório");
    } else if (passwordConfirm.trim() === "") {
      alert("A confirmação da sua password é obrigatória");
    } else if (newPassword !== passwordConfirm) {
      alert("As passwords não correspondem");
    } else if (email.trim() === "") {
      alert("O email é de preenchimento obrigatório");
    } else if (!email.includes("@")) {
      alert("O Email deve conter '@'.");
    } else if (phoneNumber.trim() === "") {
      alert("O número de telefone é obrigatório");
    } else if (!/^\d{9}$/.test(phoneNumber)) {
      alert("O número de telefone deve ter 9 dígitos.");
    } else if (url.trim() === "") {
      alert("A fotografia de perfil é obrigatória");
    } else {
      var confirm = window.confirm(
        "Pretende criar um novo registo " + firstName + "?"
      );
      if (confirm) {
        const user = {
          username: newUsername,
          password: newPassword,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          url: url,
        };
        console.log(user);
        try {
          const response = await registerUser(user);
          if (response != null) {
            try {
              const token = await login(user.username, user.password);
              if (token !== null) {
                try {
                  await getUserInformation(token);
                } catch (error) {
                  alert("Algo falhou");
                  console.error("Log user information failed:", error);
                }
              }
            } catch (error) {
              alert("Login falhou");
              console.error("Login failed:", error);
            }
          }
        } catch (error) {
          alert("Registo falhou");
          console.error("Registering failed:", error);
        }
      }
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
                onChange={(username) => setUsername(username.target.value)}
              />
            </div>
            <div className="edit-id-form-field" id="edit-id-form-field">
              <label htmlFor="edit-password">Password:</label>
              <input
                type="password"
                id="new-password"
                name="new-password"
                maxLength="30"
                onChange={(password) => setPassword(password.target.value)}
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
