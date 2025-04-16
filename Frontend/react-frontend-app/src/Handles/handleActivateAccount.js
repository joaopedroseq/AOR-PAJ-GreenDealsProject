import { activateUserAccount } from "../Api/authenticationApi";


const handleActivateAccount = async (activationToken) => {
    try {
      const response = await activateUserAccount(activationToken);
      if (response.status === 200) {
        return response;
      }
      if(response.status === 409) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  export default handleActivateAccount;
  