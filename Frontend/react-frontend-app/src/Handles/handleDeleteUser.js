import { deleteUser } from "../Api/userApi";
import errorMessages from "../Utils/constants/errorMessages";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";

//Operação de remoção permanente de utilizador
const handleDeleteUser = async(token, username) => {
        try{
          const response = await deleteUser(token, username);
          if(response.status === 200){
            return true;
          }
                
        } catch (error) {
          const toastMessage =
            errorMessages[error.message] || errorMessages.errorUnexpected;
          showErrorToast(toastMessage);
        }
      }
export default handleDeleteUser;