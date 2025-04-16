import errorMessages from "../Utils/constants/errorMessages";
import {
  showErrorToast
} from "../Utils/ToastConfig/toastConfig";
import { getAllUsers } from "../Api/userApi";

//operação de obter todas as informações de todos os utilizadore
//utilizado por admin, por isso requerer token
const handleGetAllUsers = async (token) => {
  try {
    const allUsers = await getAllUsers(token);
    return allUsers;    
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.errorUnexpected;
    showErrorToast(toastMessage);
  }
};

export default handleGetAllUsers;
