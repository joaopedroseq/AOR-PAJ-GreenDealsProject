import axios from "axios";
import { apiBaseUrl } from "../config";

//Todas as operações de utilizadores
const userEndpoint = `${apiBaseUrl}users/`;

//GET informações de UM utilizador (pode não ser o logged)
export const getUserInformation = async (username, token) => {
  try {
    const response = await axios.get(`${userEndpoint}${username}`,
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
      if (status === 400) {
        console.log('Invalid data - get user information');
        throw new Error('errorInvalidData')
      }
      if (status === 401) {
        console.log('Invalid token');
        throw new Error('errorInvalidToken')
      }
      if (status === 403) {
        console.log("permission denied");
        throw new Error("errorPermissionDenied");
      }
      if (status === 404) {
        console.log("non-existant user");
        throw new Error("non-existant_user");
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

//Update de utilizador com novas informações
export const updateUserInformation = async (token, username, userInformation) => {
  try {
    const response = await axios.patch(`${userEndpoint}${username}`,
      userInformation,
      {
        headers: {"Content-Type": "application/json",
        "token": token
        }
      }
    );
      return response;
    } catch (error) {
      console.log(error.response);
      if (error.response) {
        const status = error.response.status;
  
        if (status === 401) {
          console.log("invalid token");
          throw new Error("errorInvalidToken");
        }
        if (status === 403) {
          console.log("permission denied");
          throw new Error("errorPermissionDenied");
        }
        if (status === 404) {
          console.log("non-existant user");
          throw new Error("non-existant_user");
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

  
//GET de todas as informações de todos os utilizadores regulares (não admin)
export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${userEndpoint}`,
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
      if (status === 403) {
        console.log("permission denied");
        throw new Error("errorPermissionDenied");
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

//Excluir um utilizador
export const excludeUser = async (token, username) => {
  try {
    const response = await axios.patch(`${userEndpoint}${username}/exclude`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          'token': token
        }
      },
    );
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        console.log('Invalid data - excluding user');
        throw new Error('errorInvalidData')
      }
      if (status === 401) {
        console.log('Invalid token');
        throw new Error('errorInvalidToken')
      }
      if (status === 403) {
        console.log("permission denied");
        throw new Error("errorPermissionDenied");
      }
      if (status === 500) {
        console.log("server side exception");
        throw new Error("errorFailed");
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

//Apagar permanentemente um utilizador
export const deleteUser = async (token, username) => {
  try {
    const response = await axios.delete(`${userEndpoint}${username}`,
      {
        headers: {
          "Content-Type": "application/json",
          'token': token
        }
      },
    );
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        console.log('Invalid data - excluding user');
        throw new Error('errorInvalidData')
      }
      if (status === 401) {
        console.log('Invalid token');
        throw new Error('errorInvalidToken')
      }
      if (status === 403) {
        console.log("permission denied");
        throw new Error("errorPermissionDenied");
      }
      if (status === 404) {
        console.log("non-existant user");
        throw new Error("non-existant_user");
      }
      if (status === 500) {
        console.log("server side exception");
        throw new Error("errorFailed");
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

//Apagar todos os produtos de um utilizador
export const deleteUserProducts = async (token, username) => {
  try {
    const response = await axios.delete(`${userEndpoint}${username}/products`,
      {
        headers: {
          "Content-Type": "application/json",
          'token': token
        }
      },
    );
    return response;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.log('Invalid token');
        throw new Error('errorInvalidToken')
      }
      if (status === 403) {
        console.log("permission denied");
        throw new Error("errorPermissionDenied");
      }
      if (status === 500) {
        console.log("server side exception");
        throw new Error("errorFailed");
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



