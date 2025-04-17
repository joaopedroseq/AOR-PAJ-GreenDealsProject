import { login, getUserLogged } from "../Api/authenticationApi";
import handleNotification from "../Handles/handleNotification";



export const handleLogin = async (loginData, useUserStoreUpdates, intl) => {
  if (loginData.username.trim() === "" || loginData.password.trim() === "") {
    handleNotification(intl, "error", "noPassword");
    return;
  }

  try {
    const token = await login(loginData.username, loginData.password);
    if (token !== null) {
      await logUserInformation(token, useUserStoreUpdates, intl);
    }
  } catch (error) {
    handleNotification(intl, "error", `${error.message}`);
  }

};

export const logUserInformation = async (token, useUserStoreUpdates, intl) => {
  const { updateToken, updateIsAuthenticated } = useUserStoreUpdates;
  try {
    const userInformation = await getUserLogged(token);
    updateToken(token);
    updateIsAuthenticated();
    handleNotification(intl, "success", "welcomeNotification", {
      firstName: userInformation.firstName,
    });
  } catch (error) {
    handleNotification(intl, "error", `${error.message}`);
  }

};

export const getLoggedUserInformation = async (token, intl) => {
  try {
    const userInformation = await getUserLogged(token);
    return userInformation;
  } catch (error) {
    handleNotification(intl, "error", `${error.message}`);
  }

};
