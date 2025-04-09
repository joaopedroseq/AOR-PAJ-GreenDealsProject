import React from 'react';
import './loginForm.css'
import { useForm } from 'react-hook-form';
import { showErrorToast } from '../../Utils/ToastConfig/toastConfig';
import { handleLogin } from '../../Handles/handleLogin';
import useUserStore from '../../Stores/useUserStore';
import { FormattedMessage, useIntl } from "react-intl";

const LoginForm = ({ isOpen, isClosed, toggleRegisterModal }) => {
  //utilização de funções do useForm
  const { register, handleSubmit, reset } = useForm();
  
  //Acesso ao UserStore para operações de autenticação
  const updateToken = useUserStore((state) => state.updateToken);
  const updateIsAuthenticated = useUserStore((state) => state.updateIsAuthenticated);

  //Opções de língua
  const intl = useIntl()

  const useUserStoreUpdates = {
    updateToken,
    updateIsAuthenticated
  };

    
  const onSubmit = async (loginData) => {
    await handleLogin(loginData, useUserStoreUpdates, intl);
    reset()
    isClosed();
  };

   // Handle validation errors
   const onError = (errors) => {
    if (errors.username) {
      showErrorToast(<FormattedMessage id="noUsername"/>);
      reset()
      isClosed();
    }
    if (errors.password) {
      showErrorToast(<FormattedMessage id="noPassword"/>);
      reset()
      isClosed();
    }
  };

  return (
    isOpen && (
    <div className="dropdownLogin">
      <form id="login-form" className="login-form" onSubmit={handleSubmit(onSubmit, onError)}>
        <label htmlFor="login-form"><FormattedMessage id="logIn"/></label>
        <br />
        <label htmlFor="username"><FormattedMessage id="username"/></label>
        <input
          type="text"
          className="textbox"
          id="username"
          name="username"
          maxLength="30"
          {...register('username', { required: true })}
        />

        <label htmlFor="password"><FormattedMessage id="password"/></label>
        <input
          type="password"
          className="textbox"
          id="password"
          maxLength="30"
          {...register('password', { required: true })}
        />

        <div>
          <input type="checkbox" id="showPasswordBtn" />
          <label htmlFor="checkbox"><FormattedMessage id="showPassword"/></label>
        </div>

        <div className="login-buttons">
          <button type="submit" className="buttonSubmit" id="loginSubmit">
          <FormattedMessage id="submit"/>
          </button>
          <input
            type="button"
            className="buttonRegister"
            id="newAccountBtn"
            value={intl.formatMessage({ id: 'register' })}
            size="12px"
            onClick={toggleRegisterModal}
          />
        </div>
      </form>     
    </div>
    )
  );
};

export default LoginForm;