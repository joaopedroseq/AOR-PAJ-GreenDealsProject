import axios from "axios";
import { apiBaseUrl } from "../config";

//Todas as operações de estatisticas
const statsEndpoint = `${apiBaseUrl}stats/`;

export const getProductStatistics = async (token) => {
    try {
      const response = await axios.get(`${statsEndpoint}product`, {
        headers: {
          "Content-Type": "application/json",
          "token": token
        }
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) throw new Error("errorInvalidData");
        if (status === 401) throw new Error("errorInvalidToken");
        if (status === 403) throw new Error("errorPermissionDenied");
        if (status === 404) throw new Error("errorNotFound");
        throw new Error("errorFailed");
      }
      if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error("errorNetwork_error");
      }
      throw new Error("errorUnexpected");
    }
  };

  export const getUserStatistics = async (token) => {
    try {
      const response = await axios.get(`${statsEndpoint}user`, {
        headers: {
          "Content-Type": "application/json",
          "token": token
        }
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) throw new Error("errorInvalidData");
        if (status === 401) throw new Error("errorInvalidToken");
        if (status === 403) throw new Error("errorPermissionDenied");
        if (status === 404) throw new Error("errorNotFound");
        throw new Error("errorFailed");
      }
      if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error("errorNetwork_error");
      }
      throw new Error("errorUnexpected");
    }
  };