import { deleteUser } from "../api/userApi";
import errorMessages from "../Utils/constants/errorMessages";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";

const handleDeleteUser = async(token, username) => {
        try{
          const response = await deleteUser(token, username);
          if(response.status === 200){
            return true;
          }
                
        } catch (error) {
          const toastMessage =
            errorMessages[error.message] || errorMessages.unexpected_error;
          showErrorToast(toastMessage);
        }
      }
export default handleDeleteUser;