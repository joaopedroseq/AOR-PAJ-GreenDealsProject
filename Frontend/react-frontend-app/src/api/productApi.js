import axios from "axios";
import { apiBaseUrl } from "../config";
//axios - ordem: url, body, headers

const productsEndpoint = `${apiBaseUrl}products/`;

//Função para obter todos os produtos disponíveis
export const getProducts = async (queryParams, token) => {
  try {
    const response = await axios.get(`${productsEndpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { token } : {}),
      },
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        console.log("Error getting products");
        throw new Error("error");
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

//Add a product to the user
export const addProduct = async (product, token) => {
  console.log(product)
  try {
    const response = await axios.post(`${productsEndpoint}`, product, {
      headers: { "Content-Type": "application/json", token: token },
    });
    return response.data;
  } catch (error) {
    console.log(error.response);
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        console.log("Invalid data - adding product");
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
        console.log("non existant product");
        throw new Error("non-errorNonExistantProduct");
      }
      console.log("adding productc errorFailed " + status);
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

export const buyProduct = async (productId, token) => {
  try {
    const response = await axios.patch(`${productsEndpoint}${productId}`,
      {state: "COMPRADO"},
      {
      headers: { "Content-Type": "application/json", token: token },
    });
    return response;
  } catch (error) {
    console.log(error.response);
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        console.log("Invalid data - buying product");
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
        console.log("non existant product");
        throw new Error("errorNonExistantProduct");
      }
      console.log("adding product errorFailed " + status);
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


//Add a product to the user
export const updateProduct = async (editedProduct, token, productId) => {
    try {
    const response = await axios.patch(`${productsEndpoint}${productId}`,
      editedProduct, {
      headers: { "Content-Type": "application/json", token: token },
    });
    return response.data;
  } catch (error) {
    console.log(error.response);
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        console.log("Invalid data - adding product");
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
        console.log("non-existant category");
        throw new Error("non-existant_category");
      }
      console.log("adding productc errorFailed " + status);
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

//Delete product
export const deleteProduct = async (token, productId) => {
  try {
    const response = await axios.delete(`${productsEndpoint}${productId}`,
      {
      headers: { "Content-Type": "application/json", token: token },
    });
    return response.data;
  } catch (error) {
    console.log(error.response);
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        console.log("Invalid data - deleting product");
        throw new Error("error");
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
        console.log("product not found");
        throw new Error("non-existant_product");
      }
      console.log("adding productc errorFailed " + status);
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