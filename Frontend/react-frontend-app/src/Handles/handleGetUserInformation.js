import { getUserInformation } from "../Api/userApi";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";
import errorMessages from "../Utils/constants/errorMessages";

//operação de obter informações de um utilizador - frequentemente utilizado
export const handleGetUserInformation = async (username, token) => {
  try {
    const userInformation = await getUserInformation(username, token);
    return userInformation;
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};

export default handleGetUserInformation;