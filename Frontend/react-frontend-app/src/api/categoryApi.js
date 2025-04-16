import axios from "axios";
import { apiBaseUrl } from "../config";
//axios - ordem: url, body, headers

const categoriesEndpoint = `${apiBaseUrl}categories/`;

//Função para obter todas as categories
export const fetchCategories = async (language) => {
    try {
      const response = await axios.get(
        `${categoriesEndpoint}`, {
          params: { locale: language }, // Sends locale in the query string
          headers: {
            "Content-Type": "application/json",
          },
        });
    
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
  
        if (status === 400) {
          console.log('Error getting categories');
          throw new Error('error')
        }
      }
      if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error("errorNetwork_error");
      }
      console.log(error.response);
      throw new Error("errorUnexpected");
    }
  };

  //Adicionar categoria
  export const addCategory = async (token, newCategory) => {
    try {
      const response = await axios.post(
        `${categoriesEndpoint}`,
        newCategory,
        {
          headers: {
            "Content-Type": "application/json",
            token: token
          },
          
        }
      );
      return response;
    } catch (error) {
      console.log(error)
      if (error.response) {
        const status = error.response.status;
  
        if (status === 400) {
          console.log("Invalid data - adding category");
          throw new Error("errorInvalidData");
        }
        if (status === 401) {
          console.log("invalid token");
          throw new Error("errorInvalidToken");
        }
        if (status === 403) {
          console.log("permission denied");
          throw new Error("errorPermissionDenied");
        }
        if (status === 409) {
          console.log("category already exists");
          throw new Error("errorConflictCategory");
        }
        console.log("adding category errorFailed " + status);
        throw new Error("errorFailed");
      }
      if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error("errorNetwork_error");
      }
      console.log(error.response);
      throw new Error("errorUnexpected");
    }
  };

  //Apagar categoria
  export const deleteCategory = async (token, categoryToDelete) => {
    const categoryName = categoryToDelete.name;
    try {
      const response = await axios.delete(
        `${categoriesEndpoint}${categoryName}`,
        {
          headers: {
            "Content-Type": "application/json",
            token: token
          },
          data: categoryToDelete,
          
        }
      );
      return response;
    } catch (error) {
      console.log(error)
      if (error.response) {
        const status = error.response.status;
  
        if (status === 400) {
          console.log("Invalid data - adding category");
          throw new Error("errorInvalidData");
        }
        if (status === 401) {
          console.log("invalid token");
          throw new Error("errorInvalidToken");
        }
        if (status === 403) {
          console.log("permission denied");
          throw new Error("errorPermissionDenied");
        }
        if (status === 404) {
          console.log("category doesn't exist");
          throw new Error("errorNonExistingCategory");
        }
        console.log("adding category errorFailed " + status);
        throw new Error("errorFailed");
      }
      if (error.request) {
        console.error("No response from server:", error.request);
        throw new Error("errorNetwork_error");
      }
      console.log(error.response);
      throw new Error("errorUnexpected");
    }
  };