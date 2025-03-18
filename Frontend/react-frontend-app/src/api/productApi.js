import axios from "axios";
import { apiBaseUrl } from "../config";
//axios - ordem: url, body, headers

const productsEndpoint = `${apiBaseUrl}products/`;

//Função para obter todos os produtos disponíveis
export const getAvaibleProducts = async () => {
    try {
      const response = await axios.get(
        `${productsEndpoint}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
  
        if (status === 400) {
          console.log('Error getting products');
          throw new Error('error')
        }
      }
      if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error("network_error");
      }
      console.log(error.response);
      throw new Error("unexpected_error");
    }
  };