import { checkPassword } from "../api/authenticationApi";
import { updateUserInformation } from "../api/userApi";
import errorMessages from "../Utils/constants/errorMessages";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";

const handleChangeUserInformation = async (
  userInfo,
  updatedInfo,
  confirmPassword,
  token
) => {
  try {
    const updatesToUser = {};
    for (const key in updatedInfo) {
      if (updatedInfo[key] !== userInfo[key]) {
        updatesToUser[key] = updatedInfo[key];
      }
    }

    const isPasswordValid = await checkPassword(
      userInfo.username,
      confirmPassword
    );
    if (!isPasswordValid) {
      throw new Error("Password confirmation failed.");
    } else {
        console.log("here");
      try {
        const response = await updateUserInformation(
          token,
          userInfo.username,
          updatesToUser
        );
        console.log(response);
      } catch (error) {
        const toastMessage =
          errorMessages[error.message] || errorMessages.unexpected_error;
        showErrorToast(toastMessage);
      }
    }
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};

export default handleChangeUserInformation;
