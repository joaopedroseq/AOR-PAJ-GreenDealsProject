import { checkPassword } from "../Api/authenticationApi";
import { updateUserInformation } from "../Api/userApi";
import { buyProduct } from "../Api/productApi";
import errorMessages from "../Utils/constants/errorMessages";
import {
  showErrorToast,
  showSuccessToast,
} from "../Utils/ToastConfig/toastConfig";


//Operação de compra de produto
const handleBuyingProduct = async (productId, token) => {
  try {
    const response = await buyProduct(productId, token);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    const toastMessage =
      errorMessages[error.message] || errorMessages.unexpected_error;
    showErrorToast(toastMessage);
    return false;
  }
};

export default handleBuyingProduct;