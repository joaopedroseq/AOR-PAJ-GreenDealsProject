import { login } from "../api/authenticationApi";
import { getUserLogged } from "../api/authenticationApi";
import {
  showSuccessToast,
  showErrorToast,
} from "../Utils/ToastConfig/toastConfig";
import errorMessages from "../Utils/constants/errorMessages";

export const handleLogin = async (loginData, useUserStoreUpdates) => {
  if (loginData.username.trim() === "" || loginData.password.trim() === "") {
    showErrorToast("Os campos de utilizador e password têm de ser preenchidos");
    return;
  }
  try {
    const token = await login(loginData.username, loginData.password);
    if (token !== null) {
      await logUserInformation(token, useUserStoreUpdates);
    }
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};

export const logUserInformation = async (token, useUserStoreUpdates) => {
  const { updateToken, updateIsAuthenticated } = useUserStoreUpdates;
  try {
    const userInformation = await getUserLogged(token);
    updateToken(token);
    updateIsAuthenticated();
    showSuccessToast("Bem vindo de volta " + userInformation.firstName);
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};

export const getLoggedUserInformation = async (token) => {
  try {
    const userInformation = await getUserLogged(token);
    return userInformation;
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};
