import { deleteUserProducts } from "../Api/userApi";
import errorMessages from "../Utils/constants/errorMessages";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";


//Operação de remoção de todos os produtos de um utilzador
const handleDeleteUserProducts = async(token, username) => {
        try{
          const response = await deleteUserProducts(token, username);
          if(response.status === 200){
            return true;
          }
        } catch (error) {
          const toastMessage =
            errorMessages[error.message] || errorMessages.errorUnexpected;
          showErrorToast(toastMessage);
        }
      }
export default handleDeleteUserProducts;