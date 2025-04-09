import axios from "axios";
import { apiBaseUrl } from "../config";
//axios - ordem: url, body, headers

const userAutenticationEndpoint = `${apiBaseUrl}auth/`;

//Registo de novo utilizador
export const registerUser = async (user) => {
  try {
    const response = await axios.post(`${userAutenticationEndpoint}register`,
      user,
      {
        headers: {"Content-Type": "application/json"}
      }
    );
      return response.data;
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
      const message = error.response.data;

      if (status === 400) {
        console.log('Invalid data - login from user');
        throw new Error('invalid_data')
      }
      if (status === 401) {
        console.log('wrong username/password');
        throw new Error('wrong_username_password')
      }
      if (status === 403) {
        if (message === "Forbidden - inactive user") {
          console.log('Account is inactive');
          throw new Error('account_inactive');
        }
        if (message === "Forbidden - excluded user") {
          console.log('Account is excluded');
          throw new Error('account_excluded');
        }    
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

//Activar conta de utilizador
export const activateUserAccount = async (activationToken) => {
  try {
    const response = await axios.post(`${userAutenticationEndpoint}activate`,
      {
        headers: {
          "Content-Type": "application/json",
          'token': activationToken
        }
      },
    );
    return response.data;
  } catch (error) {
    console.log(error.response);
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data;

      if (status === 409) {
        if (message?.newToken) {
          console.log("Token expired. New token:", message.newToken);
          return message.newToken; // Return the new token so it can be shown to the user
        } else {
          throw new Error("token_expired_no_new_token");
        }
      }

      if (status === 403) {
        if (message === "Bad request - already active account") {
          console.log('Account is already active');
          throw new Error('account_already_active');
        }
        if (message === "Bad request - excluded account") {
          console.log('Account is excluded');
          throw new Error('account_excluded');
        }    
      }
      if (status === 401) {
        console.log('invalid token');
        throw new Error('invalid_token')
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