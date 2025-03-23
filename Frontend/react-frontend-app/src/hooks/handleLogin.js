import { login } from "../api/authenticationApi";
import { getUserLogged } from "../api/userApi";
import {
  showSuccessToast,
  showErrorToast,
} from "../Utils/ToastConfig/toastConfig";

export const handleLogin = async (loginData, userStoreUpdates) => {
  if (loginData.username.trim() === "" || loginData.password.trim() === "") {
    showErrorToast("Os campos de utilizador e password têm de ser preenchidos");
    return;
  }
  try {
    const token = await login(loginData.username, loginData.password);
    if (token !== null) {
      await logUserInformation(token, userStoreUpdates);
    }
  } catch (error) {
    if (error.message === "invalid_data") {
      showErrorToast("dados inválidos");
    }
    if (error.message === "wrong_password") {
      showErrorToast(
        "O email ou palavra-passe que introduziu não estão corretos."
      );
    }
    if (error.message === "unexpected_error") {
      showErrorToast("Login failed");
    }
  }
};

export const logUserInformation = async (token, userStoreUpdates) => {
  const { updateToken, updateIsAuthenticated } = userStoreUpdates;
  try {
    const userInformation = await getUserLogged(token);
    updateToken(token);
    updateIsAuthenticated();
    showSuccessToast("Bem vindo de volta " + userInformation.firstName);
  } catch (error) {
    if (error.message === "invalid_token") {
      showErrorToast(
        "Token inválido - faça logout de todas as sessões e tente novamente"
      );
    }
    if (error.message === "unexpected_error") {
      showErrorToast("Falha inesperada");
    }
  }
};

export const getUserInformation = async (token) => {
  try {
    const userInformation = await getUserLogged(token);
    return userInformation;
  } catch (error) {
    if (error.message === "invalid_token") {
      showErrorToast(
        "Token inválido - faça logout de todas as sessões e tente novamente"
      );
    }
    if (error.message === "unexpected_error") {
      showErrorToast("Falha inesperada");
    }
  }
};
