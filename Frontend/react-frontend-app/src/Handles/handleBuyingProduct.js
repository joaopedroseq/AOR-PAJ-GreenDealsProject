import { checkPassword } from "../api/authenticationApi";
import { updateUserInformation } from "../api/userApi";
import errorMessages from "../Utils/constants/errorMessages";
import {
  showErrorToast,
  showSuccessToast,
} from "../Utils/ToastConfig/toastConfig";
import { buyProduct } from "../api/productApi";

const handleBuyingProduct = async (productId, token) => {
  try {
    console.log(productId);
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
