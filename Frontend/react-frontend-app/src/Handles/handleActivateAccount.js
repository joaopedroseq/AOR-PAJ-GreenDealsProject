import { activateUserAccount } from "../api/authenticationApi";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";
import errorMessages from "../Utils/constants/errorMessages";
import { useEffect } from "react";

const handleActivateAccount = async (activationToken) => {
    try {
      console.log(activationToken);
      const response = await activateUserAccount(activationToken);
      if (response.status === 200) {
        console.log('true');
      }
      if(response.status === 409) {
        console.log('new token')
        console.log(response)
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  export default handleActivateAccount;
  