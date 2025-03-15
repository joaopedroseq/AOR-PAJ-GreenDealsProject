import axios from "axios";
import { apiBaseUrl } from "../config";

const userEndpoint = `${apiBaseUrl}user/`;

export const getUserInformation = async (token) => {
  try {
    const response = await axios.get(`${userEndpoint}user`,
      {
        headers: {
          "Content-Type": "application/json",
          'token': token
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response);
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.log('Invalid token');
        throw new Error('invalid_token')
      }
      console.log('get user information failed ' + status)
      throw new Error('failed')
    }
    if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("network_error");
    }
    console.log(error.response);
    throw new Error("unexpected_error");
  }
};

export const registerUser = async (user) => {
  try {
    const response = await axios.post(`${userEndpoint}register`,
      user,
      {
        headers: {"Content-Type": "application/json"}
      }
    );
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        alert("Registo falhado. Falta de parâmetros para criação de novo registo")
        throw new Error("Bad Request: Missing parameters.");
      } else if (error.response.status === 409) {
        alert("Registo falhou. Esse nome de utilizador já existe.")
        throw new Error("Conflict: User already exists.");
      }
    }
    throw new Error("Register failed");
  }
};
