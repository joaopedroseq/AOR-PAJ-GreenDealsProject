import { getAllUsers } from "../Api/userApi";
import handleNotification from "./handleNotification";

//operação de obter todas as informações de todos os utilizadore
//utilizado por admin, por isso requerer token
const handleGetAllUsers = async (token, intl) => {
  try {
    const allUsers = await getAllUsers(token);
    return allUsers;    
  } catch (error) {
    handleNotification(intl, "error", `${error.message}`);
  }
};

export default handleGetAllUsers;
