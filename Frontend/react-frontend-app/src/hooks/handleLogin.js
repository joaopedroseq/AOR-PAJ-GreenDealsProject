import { login } from "../api/authenticationApi";
import { getUserInformation } from "../api/userApi";
import {
  showSuccessToast,
  showErrorToast,
} from "../Utils/ToastConfig/toastConfig";
import { userStore } from "../stores/userStore";

export const handleLogin = async (loginData, userStoreUpdates) => {
  if (loginData.username.trim() === "" || loginData.password.trim() === "") {
    showErrorToast("Os campos de utilizador e password têm de ser preenchidos");
    return;
  }
  try {
    const token = await login(loginData.username, loginData.password);
    console.log(token);
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

const logUserInformation = async (token, userStoreUpdates) => {
  
  const {
    updateUsername,
    updateToken,
    updateIsAuthenticated,
    updateIsAdmin,
    updateUrlPhoto,
    updateFirstName,
  } = userStoreUpdates;
  try {
    console.log("updateUsername function:", updateUsername);
    const userInformation = await getUserInformation(token);
    updateUsername(userInformation.username);
    updateToken(token);
    updateIsAuthenticated();
    updateIsAdmin(userInformation.admin);
    updateUrlPhoto(userInformation.url);
    updateFirstName(userInformation.firstName);
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
