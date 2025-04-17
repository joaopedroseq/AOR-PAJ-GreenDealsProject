import { getUserInformation } from "../Api/userApi";
import handleNotification from "./handleNotification";

//operação de obter informações de um utilizador - frequentemente utilizado
export const handleGetUserInformation = async (username, token, intl) => {
  try {
    const userInformation = await getUserInformation(username, token);
    return userInformation;
  } catch (error) {
    handleNotification(intl, "error", `${error.message}`);
  }
};

export default handleGetUserInformation;