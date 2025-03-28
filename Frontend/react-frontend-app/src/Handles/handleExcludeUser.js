import { excludeUser } from "../api/userApi";
import errorMessages from "../Utils/constants/errorMessages";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";

const handleExcludeUser = async(token, username) => {
        try{
          const response = await excludeUser(token, username);
          if(response.status === 200){
            return true;
          }
                
        } catch (error) {
          const toastMessage =
            errorMessages[error.message] || errorMessages.unexpected_error;
          showErrorToast(toastMessage);
        }
      }
export default handleExcludeUser;