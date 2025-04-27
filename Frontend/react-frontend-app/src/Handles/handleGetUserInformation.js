import { getAllUsers } from "../Api/userApi";
import handleNotification from "./handleNotification";

//operação de obter informações de um utilizador - frequentemente utilizado
export const handleGetUserInformation = async (token, username, intl) => {
  try {
    console.log(token);
    console.log(username);
    const userInformation = await getAllUsers(token, username);
    return userInformation;
  } catch (error) {
    handleNotification(intl, "error", `${error.message}`);
  }
};

export default handleGetUserInformation;