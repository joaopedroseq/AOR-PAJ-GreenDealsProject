import { buyProduct } from "../Api/productApi";
import handleNotification from "./handleNotification";


//Operação de compra de produto
const handleBuyingProduct = async (productId, token, intl) => {
  try {
    const response = await buyProduct(productId, token);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    handleNotification(intl, "error", `${error.message}`);
    return false;
  }
};

export default handleBuyingProduct;