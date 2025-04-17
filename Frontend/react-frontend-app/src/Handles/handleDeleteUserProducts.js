import { deleteUserProducts } from "../Api/userApi";
import handleNotification from "./handleNotification";


//Operação de remoção de todos os produtos de um utilzador
const handleDeleteUserProducts = async(token, username, intl) => {
        try{
          const response = await deleteUserProducts(token, username);
          if(response.status === 200){
            return true;
          }
        } catch (error) {
          handleNotification(intl, "error", `${error.message}`);
        }
      }
export default handleDeleteUserProducts;