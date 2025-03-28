import { checkPassword } from "../api/authenticationApi";
import { updateUserInformation } from "../api/userApi";
import errorMessages from "../Utils/constants/errorMessages";
import {
  showErrorToast,
  showSuccessToast,
} from "../Utils/ToastConfig/toastConfig";

const handleChangeUserInformation = async (
  userInfo,
  updatedInfo,
  confirmPassword,
  token,
  isAdmin
) => {
  try {
    const updatesToUser = {};
    for (const key in updatedInfo) {
      if (updatedInfo[key] !== userInfo[key]) {
        updatesToUser[key] = updatedInfo[key];
      }
    }
    console.log(updatesToUser)
    console.log(isAdmin);

    let isPasswordValid;
    if (!isAdmin) {
      isPasswordValid = await checkPassword(userInfo.username, confirmPassword);
    } else {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      throw new Error("Password confirmation failed.");
    } else {
      try {
        const response = await updateUserInformation(
          token,
          userInfo.username,
          updatesToUser
        );
        console.log(response.status);
        if (response.status === 200) {
          showSuccessToast("Alterações efetuadas com sucesso");
          return true;
        }
      } catch (error) {
        const toastMessage =
          errorMessages[error.message] || errorMessages.unexpected_error;
        showErrorToast(toastMessage);
        return false;
      }
    }
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};

export default handleChangeUserInformation;
