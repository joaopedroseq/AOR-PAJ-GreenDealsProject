import { login } from "../api/authenticationApi";
import { getUserLogged } from "../api/userApi";
import {
  showSuccessToast,
  showErrorToast,
} from "../Utils/ToastConfig/toastConfig";
import errorMessages from "../Utils/constants/errorMessages";

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
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
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
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};

export const getUserInformation = async (token) => {
  try {
    const userInformation = await getUserLogged(token);
    return userInformation;
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};
