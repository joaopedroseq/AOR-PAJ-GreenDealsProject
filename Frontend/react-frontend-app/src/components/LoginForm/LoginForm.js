import React from 'react';
import { useForm } from 'react-hook-form';
import { showErrorToast } from '../../Utils/ToastConfig/toastConfig';
import { handleLogin } from '../../Handles/handleLogin';
import useUserStore from '../../stores/useUserStore';

const LoginForm = ({ toggleRegisterModal }) => {
  const { register, handleSubmit } = useForm();
  const updateToken = useUserStore((state) => state.updateToken);
  const updateIsAuthenticated = useUserStore((state) => state.updateIsAuthenticated);

  const useUserStoreUpdates = {
    updateToken,
    updateIsAuthenticated
  };



  const onSubmit = async (loginData) => {
    await handleLogin(loginData, useUserStoreUpdates);
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

        <div className="login-buttons">
          <button type="submit" className="buttonSubmit" id="loginSubmit">
            Submit
          </button>
          <input
            type="button"
            className="buttonRegister"
            id="newAccountBtn"
            value="Register"
            size="12px"
            onClick={toggleRegisterModal}
          />
        </div>
      </form>
      
      
    </div>
  );
};

export default LoginForm;