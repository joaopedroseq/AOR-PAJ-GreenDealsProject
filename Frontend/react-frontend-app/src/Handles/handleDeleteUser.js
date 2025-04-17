import { deleteUser } from "../Api/userApi";
import handleNotification from "./handleNotification";

//Operação de remoção permanente de utilizador
const handleDeleteUser = async(token, username, intl) => {
        try{
          const response = await deleteUser(token, username);
          if(response.status === 200){
            return true;
          }
                
        } catch (error) {
          handleNotification(intl, "error", `${error.message}`);
        }
      }
export default handleDeleteUser;