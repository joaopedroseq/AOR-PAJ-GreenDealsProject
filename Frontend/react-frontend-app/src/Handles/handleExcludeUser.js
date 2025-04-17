import { excludeUser } from "../Api/userApi";
import handleNotification from "./handleNotification";

//operação de excluir um utilizador
const handleExcludeUser = async(token, username, intl) => {
        try{
          const response = await excludeUser(token, username);
          if(response.status === 200){
            return true;
          }
                
        } catch (error) {
          handleNotification(intl, "error", `${error.message}`);
        }
      }
export default handleExcludeUser;