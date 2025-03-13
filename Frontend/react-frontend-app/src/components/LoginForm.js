import React, { useState } from "react";
import useLogin from "../hooks/useLogin";
import "../styles/header.css";
import RegisterModal from "./RegisterModal";

function LoginForm({ toggleRegisterModal }) {
  const {
    username,
    password,
    setUsername,
    setPassword,
    handleLogin,
    isAuthenticated,
  } = useLogin();


  return isAuthenticated ? null : (
    <div className="dropdownLogin">
      <form id="login-form" className="login-form" onSubmit={handleLogin}>
        <label htmlFor="login-form">Log In</label>
        <br />
        <label htmlFor="login-form">Username</label>
        <input
          type="text"
          className="textbox"
          id="username"
          name="username"
          maxLength="30"
          value={username}
          onChange={(usernameBox) => setUsername(usernameBox.target.value)}
        />
        <label htmlFor="login-form">Password</label>
        <input
          type="password"
          className="textbox"
          id="password"
          maxLength="30"
          value={password}
          onChange={(passwordBox) => setPassword(passwordBox.target.value)}
        />
        <div>
          <input type="checkbox" id="showPasswordBtn" />
          <label htmlFor="checkbox">mostrar password</label>
          <input
            type="submit"
            className="buttonSubmit"
            id="loginSubmit"
            value="submit"
            size="12px"
          />
        </div>
      </form>
      <div className="buttons">
        <input
          type="button"
          className="buttonRegister"
          id="newAccountBtn"
          value="register"
          size="12px"
          onClick={toggleRegisterModal}
        />
      </div>
    </div>
  );
}

export default LoginForm;