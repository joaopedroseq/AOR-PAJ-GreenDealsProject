import errorMessages from "../Utils/constants/errorMessages";
import {
  showErrorToast
} from "../Utils/ToastConfig/toastConfig";
import { getAllUsers } from "../api/userApi";

const handleGetAllUsers = async (token) => {
  try {
    const allUsers = await getAllUsers(token);
    return allUsers;    
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
  }
};

export default handleGetAllUsers;
