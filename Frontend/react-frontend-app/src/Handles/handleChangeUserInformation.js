import { checkPassword } from "../Api/authenticationApi";
import { updateUserInformation } from "../Api/userApi";
import errorMessages from "../Utils/constants/errorMessages";
import {
  showErrorToast,
  showSuccessToast,
} from "../Utils/ToastConfig/toastConfig";

//Operações de update de informações de utilizador
const handleChangeUserInformation = async (
  userInfo,
  updatedInfo,
  confirmPassword,
  token,
  isAdmin
) => {
  try {
    //check por contraposição entre que informações se mantém e quais são novas
    //para que backend recebe apenas patch com as novas informações
    const updatesToUser = {};
    for (const key in updatedInfo) {
      if (updatedInfo[key] !== userInfo[key]) {
        updatesToUser[key] = updatedInfo[key];
      }
    }
    console.log(updatesToUser)
    console.log(isAdmin);

    //check da password CASO o utilizador requisitante não seja admin
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
