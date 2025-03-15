import axios from "axios";
import { apiBaseUrl } from "../config";

const userEndpoint = `${apiBaseUrl}user/`;

export const getUserInformation = async (token) => {
  try {
    const response = await axios.get(`${userEndpoint}user`,
      {
        headers: {
          "Content-Type": "application/json",
          'token': token
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response);
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

export const registerUser = async (user) => {
  console.log(user)
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
    console.log(error.response);
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
