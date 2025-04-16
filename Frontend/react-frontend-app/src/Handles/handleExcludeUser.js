import { excludeUser } from "../Api/userApi";
import errorMessages from "../Utils/constants/errorMessages";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";

//operação de excluir um utilizador
const handleExcludeUser = async(token, username) => {
        try{
          const response = await excludeUser(token, username);
          if(response.status === 200){
            return true;
          }
                
        } catch (error) {
          const toastMessage =
            errorMessages[error.message] || errorMessages.errorUnexpected;
          showErrorToast(toastMessage);
        }
      }
export default handleExcludeUser;