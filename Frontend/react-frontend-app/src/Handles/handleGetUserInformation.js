import { getUserInformation } from "../api/userApi";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";
import errorMessages from "../Utils/constants/errorMessages";

export const handleGetUserInformation = async (username, token) => {
  try {
    const userInformation = await getUserInformation(username, token);
    console.log(userInformation);
    return userInformation;
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};

export default handleGetUserInformation;