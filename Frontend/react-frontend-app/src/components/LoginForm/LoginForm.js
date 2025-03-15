import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { showErrorToast } from '../../Utils/ToastConfig/toastConfig';
import { handleLogin } from '../../hooks/handleLogin';
import userStore from '../../stores/userStore';

const LoginForm = ({ toggleRegisterModal }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

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



  const onSubmit = async (loginData) => {
    await handleLogin(loginData, userStoreUpdates);
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