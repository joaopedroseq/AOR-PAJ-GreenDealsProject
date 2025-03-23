import axios from "axios";
import { apiBaseUrl } from "../config";
//axios - ordem: url, body, headers

const productsEndpoint = `${apiBaseUrl}products`;

//Função para obter todos os produtos disponíveis
export const getProducts = async (queryParams, token) => {
  const queryString = new URLSearchParams(queryParams).toString();
  try {
    const response = await axios.get(`${productsEndpoint}?${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { token } : {}),
      },
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
      throw new Error("network_error");
    }
    console.log(error.response);
    throw new Error("unexpected_error");
  }
};

//Add a product to the user
export const addProduct = async (product, token) => {
  console.log(product);
  console.log(token);
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
        throw new Error("invalid_data");
      }
      if (status === 401) {
        console.log("invalid token");
        throw new Error("invalid_token");
      }
      if (status === 403) {
        console.log("permission denied");
        throw new Error("permission_denied");
      }
      if (status === 404) {
        console.log("non-existant category");
        throw new Error("non-existant_category");
      }
      console.log("adding productc failed " + status);
      throw new Error("failed");
    }
    if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("network_error");
    }
    console.log(error.response);
    throw new Error("unexpected_error");
  }
};


//Add a product to the user
export const updateProduct = async (editedProduct, token, productId) => {
  console.log(editedProduct);
  console.log(token);
  console.log(productId);
  try {
    const response = await axios.patch(`${productsEndpoint}/${productId}`,
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
        throw new Error("invalid_data");
      }
      if (status === 401) {
        console.log("invalid token");
        throw new Error("invalid_token");
      }
      if (status === 403) {
        console.log("permission denied");
        throw new Error("permission_denied");
      }
      if (status === 404) {
        console.log("non-existant category");
        throw new Error("non-existant_category");
      }
      console.log("adding productc failed " + status);
      throw new Error("failed");
    }
    if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("network_error");
    }
    console.log(error.response);
    throw new Error("unexpected_error");
  }
};

//Add a product to the user
export const deleteProduct = async (token, productId) => {
  console.log(token);
  console.log(productId);
  try {
    const response = await axios.delete(`${productsEndpoint}/${productId}`,
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
        throw new Error("invalid_token");
      }
      if (status === 403) {
        console.log("permission denied");
        throw new Error("permission_denied");
      }
      if (status === 404) {
        console.log("product not found");
        throw new Error("non-existant_product");
      }
      console.log("adding productc failed " + status);
      throw new Error("failed");
    }
    if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("network_error");
    }
    console.log(error.response);
    throw new Error("unexpected_error");
  }
};