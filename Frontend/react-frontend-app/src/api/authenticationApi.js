import axios from "axios";
import { apiBaseUrl } from "../config";
//axios - ordem: url, body, headers

const userAuthenticationEndpoint = `${apiBaseUrl}auth/`;

//Registo de novo utilizador
export const registerUser = async (user) => {
  try {
    const response = await axios.post(`${userAuthenticationEndpoint}register`,
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
        throw new Error('errorInvalidData')
      }
      if (status === 409) {
        console.log('username already exists');
        throw new Error('errorSameUsername')
      }
      console.log('register errorFailed ' + status)
      throw new Error('errorFailed')
    }
    if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("errorNetwork_error");
    }
    console.log(error.response);
    throw new Error("errorUnexpected");
  }
};

//Função para login
export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${userAuthenticationEndpoint}login`,
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
        throw new Error('errorInvalidData')
      }
      if (status === 401) {
        console.log('wrong username/password');
        throw new Error('errorWrongUsernamePassword')
      }
      if (status === 403) {
        if (message === "errorForbidden - inactive user") {
          console.log('Account is inactive');
          throw new Error('errorAccountInactive');
        }
        if (message === "errorForbidden - excluded user") {
          console.log('Account is excluded');
          throw new Error('errorAccountExcluded');
        }    
      }
      console.log('login errorFailed ' + status)
      throw new Error('errorFailed')
    }
    if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("errorNetwork_error");
    }
    console.log(error.response);
    throw new Error("errorUnexpected");
  }
};

//Função para logout
export const logout = async (token) => {
  try {
    const response = await axios.post(
      `${userAuthenticationEndpoint}logout`,
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
        throw new Error('errorInvalidToken')
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

//Função para verificar se a password está correta
//utilizada em operações de alteração de informações e certas operações de administrador
export const checkPassword = async (username, password) => {
  try {
    const response = await axios.post(
      `${userAuthenticationEndpoint}confirm-password/`,
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
        throw new Error('errorInvalidData')
      }
      if (status === 401) {
        console.log('wrong password');
        throw new Error('errorWrongPassword')
      }
      console.log('login errorFailed ' + status)
      throw new Error('errorFailed')
    }
    if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("errorNetwork_error");
    }
    console.log(error.response);
    throw new Error("errorUnexpected");
  }
};

//GET informações do utilizador logged
export const getUserLogged = async (token) => {
  try {
    const response = await axios.get(`${userAuthenticationEndpoint}me`,
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
        throw new Error('errorInvalidToken')
      }
      console.log('get user information errorFailed ' + status)
      throw new Error('errorFailed')
    }
    if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("errorNetwork_error");
    }
    console.log(error.response);
    throw new Error("errorUnexpected");
  }
};

//Activar conta de utilizador
export const activateUserAccount = async (activationToken) => {
  try {
    const response = await axios.post(`${userAuthenticationEndpoint}activate`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          'token': activationToken
        }
      },
    );
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data;

      if (status === 409) {
        try {
            if (message?.activationToken) {
                return error.response;
            }
        } catch (parseError) {
            console.error("Error parsing expired token response:", parseError);
            throw new Error("token_expired_no_new_token");
        }
    }

      if (status === 403) {
        if (message === "Bad request - already active account") {
          console.log('Account is already active');
          throw new Error('errorAccountAlreadyActive');
        }
        if (message === "Bad request - excluded account") {
          console.log('Account is excluded');
          throw new Error('errorAccountExcluded');
        }    
      }
      if (status === 401) {
        console.log('invalid token');
        throw new Error('errorInvalidToken')
      }
      console.log('errorFailed ' + status)
      throw new Error('errorFailed')
    }
    if (error.request) {
      console.error("No response from server:", error.request);
      throw new Error("errorNetwork_error");
    }
    console.log(error.response);
    throw new Error("errorUnexpected");
  }
};

export const requestPasswordReset = async (token) => {
  if (!token) {
    console.error("Missing authentication token");
    throw new Error("errorMissingToken");
  }

  try {
    const response = await axios.post(`${userAuthenticationEndpoint}request-password-reset`, 
      {},
      { headers: { "Content-Type": "application/json", "token": token } }
    );

    return response.data;

  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.error("Invalid or expired authentication token");
        throw new Error("errorInvalidToken");
      }
      console.error("Password reset request failed:", status);
      throw new Error("errorRequestFailed");
    }

    console.error("Network error:", error.request || error.message);
    throw new Error("errorUnexpected");
  }
};


export const resetPassword = async (token, newPassword) => {
  if (!token) {
    console.error("Missing password reset token");
    throw new Error("errorMissingToken");
  }

  try {
    const response = await axios.post(`${userAuthenticationEndpoint}reset-password`,
      newPassword, // ✅ Send password as raw text (not `{ newPassword }`)
      {
        headers: {
          "Content-Type": "text/plain", // ✅ Matches backend expectation
          "token": token // ✅ Token remains in header
        }
      }
    );

    return response.data;

  } catch (error) {
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        console.error("Invalid password format");
        throw new Error("errorInvalidPassword");
      }
      if (status === 401) {
        console.error("Invalid or expired token");
        throw new Error("errorInvalidToken");
      }
      
      console.error("Password reset failed:", status);
      throw new Error("errorResetFailed");
    }

    console.error("Network error:", error.request || error.message);
    throw new Error("errorUnexpected");
  }
};