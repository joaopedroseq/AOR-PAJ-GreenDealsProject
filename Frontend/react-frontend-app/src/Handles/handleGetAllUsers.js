import { getAllUsers } from "../Api/userApi";
import handleNotification from "./handleNotification";

//operação de obter todas as informações de todos os utilizadore
//utilizado por admin, por isso requerer token
const handleGetAllUsers = async (token, username, intl) => {
  try {
    const allUsers = await getAllUsers(token, username);
    console.log(allUsers);
    return allUsers;
  } catch (error) {
    handleNotification(intl, "error", `${error.message}`);
  }
};

export default handleGetAllUsers;
