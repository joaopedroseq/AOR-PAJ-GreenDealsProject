import axios from "axios";
import { apiBaseUrl } from "../config";

const userEndpoint = `${apiBaseUrl}users/`;

//Get user logged
export const getUserLogged = async (token) => {
  try {
    const response = await axios.get(`${userEndpoint}me`,
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

//Get user information
export const getUser = async (username, token) => {
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

//Register new user
export const registerUser = async (user) => {
  try {
    await axios.post(`${userEndpoint}register`,
      user,
      {
        headers: {"Content-Type": "application/json"}
      }
    );
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

//Patch user inforamtion
export const updateUserInformation = async (token, username, userInformation) => {
  console.log(token);
  console.log(username);
  console.log(userInformation);
  try {
    const response = await axios.patch(`${userEndpoint}${username}`,
      userInformation,
      {
        headers: {"Content-Type": "application/json",
        "token": token
        }
      }
    );
      return response.data;
    } catch (error) {
      console.log(error.response);
      if (error.response) {
        const status = error.response.status;
  
        if (status === 401) {
          console.log("invalid token");
          throw new Error("invalid_token");
        }
        if (status === 403) {
          console.log("permission denied");
          throw new Error("permission_denied");
        }
        if (status === 404) {
          console.log("non-existant user");
          throw new Error("non-existant_user");
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