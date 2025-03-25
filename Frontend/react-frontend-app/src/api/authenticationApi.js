import axios from "axios";
import { apiBaseUrl } from "../config";
//axios - ordem: url, body, headers

const userAutenticationEndpoint = `${apiBaseUrl}users/`;



//Função para login
export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${userAutenticationEndpoint}login`,
      {
        username: username,
        password: password,
      },
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response);
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        console.log('Invalid data - login from user');
        throw new Error('invalid_data')
      }
      if (status === 401) {
        console.log('wrong username/password');
        throw new Error('wrong_username_password')
      }
      console.log('login failed ' + status)
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

//Função para logout
export const logout = async (token) => {
  console.log("logout token:" + token);
  try {
    const response = await axios.post(
      `${userAutenticationEndpoint}logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );
    return true;
  } catch (error) {
    console.log(error.response);
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.log('Invalid token');
        throw new Error('invalid_token')
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

//Função para login
export const checkPassword = async (username, password) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}auth/confirm-password`,
      {
        username: username,
        password: password,
      },
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response);
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        console.log('Invalid data - login from user');
        throw new Error('invalid_data')
      }
      if (status === 401) {
        console.log('wrong password');
        throw new Error('wrong_password')
      }
      console.log('login failed ' + status)
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