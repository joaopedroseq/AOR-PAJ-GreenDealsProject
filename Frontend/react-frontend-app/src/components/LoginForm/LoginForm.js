import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showSuccessToast, showErrorToast } from '../../Utils/ToastConfig/toastConfig';
import { login } from "../../api/authenticationApi";
import { getUserInformation } from "../../api/userApi";
import { userStore } from "../../stores/userStore";

const LoginForm = ({ toggleRegisterModal }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const updateUsername = userStore((state) => state.updateUsername);
  const updateToken = userStore((state) => state.updateToken);
  const updateIsAuthenticated = userStore((state) => state.updateIsAuthenticated);
  const updateIsAdmin = userStore((state) => state.updateIsAdmin);
  const updateUrlPhoto = userStore((state) => state.updateUrlPhoto);
  const updateFirstName = userStore((state) => state.updateFirstName);

  const onSubmit = async (loginData) => {
    if (loginData.username.trim() === "" || loginData.password.trim() === "") {
      showErrorToast('Os campos de utilizador e password têm de ser preenchidos');
    } else {
      try {
        const token = await login(loginData.username, loginData.password);
        if (token !== null) {
          await logUserInformation(token);
        }
      } catch (error) {
        if(error.message === 'invalid_data'){
          showErrorToast('dados inválidos');
        }
        if(error.message === 'wrong_password'){
          showErrorToast('O email ou palavra-passe que introduziu não estão corretos.');
        }
        if(error.message === 'unexpected_error'){
          showErrorToast('Login failed');
        }
      }
    }
  };

  const logUserInformation = async(token) => {
     try {
          const userInformation = await getUserInformation(token);
          updateUsername(userInformation.username);
          updateToken(token);
          updateIsAuthenticated();
          updateIsAdmin(userInformation.admin);
          updateUrlPhoto(userInformation.url);
          updateFirstName(userInformation.firstName);
          showSuccessToast('Bem vindo de volta ' + userInformation.firstName);
        } catch (error) {
          if(error.message === 'invalid_token'){
            showErrorToast('Token inválido - faça logout de todas as sessões e tente novamente');
          }
          if(error.message === 'unexpected_error'){
            showErrorToast('Falha inesperada');
          }
        }
    };


   // Handle validation errors
   const onError = (errors) => {
    if (errors.username) {
      showErrorToast('Por favor, preencha o nome de utilizador.');
    }
    if (errors.password) {
      showErrorToast('Por favor, preencha a sua password.');
    }
  };

  return (
    <div className="dropdownLogin">
      <form id="login-form" className="login-form" onSubmit={handleSubmit(onSubmit, onError)}>
        <label htmlFor="login-form">Log In</label>
        <br />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="textbox"
          id="username"
          name="username"
          maxLength="30"
          {...register('username', { required: true })}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="textbox"
          id="password"
          maxLength="30"
          {...register('password', { required: true })}
        />

        <div>
          <input type="checkbox" id="showPasswordBtn" />
          <label htmlFor="checkbox">Mostrar password</label>
        </div>

        <button type="submit" className="buttonSubmit" id="loginSubmit">
          Submit
        </button>
      </form>

      <div className="buttons">
        <input
          type="button"
          className="buttonRegister"
          id="newAccountBtn"
          value="Register"
          size="12px"
          onClick={toggleRegisterModal}
        />
      </div>
    </div>
  );
};

export default LoginForm;