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
    if (response.status === 200) {
      return response.data;
    }
    if (response.status === 401) {
      alert("Token inválido");
      throw new Error("Get user information" + response.status);
    }
  } catch (error) {
    throw new Error("Login failed");
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
