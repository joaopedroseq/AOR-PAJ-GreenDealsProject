import axios from "axios";
import { apiBaseUrl } from "../config";
//axios - ordem: url, body, headers

const userAutenticationEndpoint = `${apiBaseUrl}auth/`;

//Registo de novo utilizador
export const registerUser = async (user) => {
  try {
    await axios.post(`${userAutenticationEndpoint}register`,
      user,
      {
        headers: {"Content-Type": "application/json"}
      }
    );
  console.log("ran")
      return true;
    }
  catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        console.log('Invalid data - registering user');
        throw new Error('invalid_data')
      }
      if (status === 409) {
        console.log('username already exists');
        throw new Error('same_username')
      }
      console.log('register failed ' + status)
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
      if (status === 403) {
        console.log('excluded user');
        throw new Error('forbidden')
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

//Função para verificar se a password está correta
//utilizada em operações de alteração de informações e certas operações de administrador
export const checkPassword = async (username, password) => {
  try {
    const response = await axios.post(
      `${userAutenticationEndpoint}confirm-password/`,
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

//GET informações do utilizador logged
export const getUserLogged = async (token) => {
  try {
    const response = await axios.get(`${userAutenticationEndpoint}me`,
      {
        headers: {
          "Content-Type": "application/json",
          'token': token
        }
      },
    );
    return response.data;
  } catch (error) {
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

