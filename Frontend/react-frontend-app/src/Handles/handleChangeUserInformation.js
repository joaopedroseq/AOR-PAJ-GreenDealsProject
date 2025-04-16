import { checkPassword } from "../Api/authenticationApi";
import { updateUserInformation } from "../Api/userApi";
import handleNotification from "./handleNotification";

//Operações de update de informações de utilizador
const handleChangeUserInformation = async (
  userInfo,
  updatedInfo,
  confirmPassword,
  token,
  isAdmin,
  intl
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

    //check da password CASO o utilizador requisitante não seja admin
    let isPasswordValid;
    if (!isAdmin) {
      isPasswordValid = await checkPassword(userInfo.username, confirmPassword);
    } else {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      throw new Error("Password confirmation errorFailed.");
    } else {
      try {
        const response = await updateUserInformation(
          token,
          userInfo.username,
          updatesToUser
        );
        if (response.status === 200) {
          handleNotification(intl, "success", "handleChangeUserInformationSucess")
          return true;
        }
      } catch (error) {
        handleNotification(intl, "error", `${error.message}`);
        return false;
      }
    }
  } catch (error) {
    handleNotification(intl, "error", `${error.message}`);
  }
};

export default handleChangeUserInformation;
