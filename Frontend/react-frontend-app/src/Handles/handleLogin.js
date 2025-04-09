import { login, getUserLogged } from "../Api/authenticationApi";
import {
  showSuccessToast,
  showErrorToast,
} from "../Utils/ToastConfig/toastConfig";
import errorMessages from "../Utils/constants/errorMessages";
import { FormattedMessage } from "react-intl";

export const handleLogin = async (loginData, useUserStoreUpdates, intl) => {

  if (loginData.username.trim() === "" || loginData.password.trim() === "") {
    showErrorToast(<FormattedMessage id="noUserNoPassword"/>);
    return;
  }
  try {
    const token = await login(loginData.username, loginData.password);
    if (token !== null) {
      await logUserInformation(token, useUserStoreUpdates, intl);
    }
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};

export const logUserInformation = async (token, useUserStoreUpdates, intl) => {
  const { updateToken, updateIsAuthenticated } = useUserStoreUpdates;
  try {
    const userInformation = await getUserLogged(token);
    updateToken(token);
    updateIsAuthenticated();
    showSuccessToast(`${intl.formatMessage({ id: 'welcomeNotification' }, { firstName: userInformation.firstName })}`);
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
