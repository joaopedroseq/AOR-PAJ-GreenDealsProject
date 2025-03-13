import axios from "axios";

const hostUrl = 'http://localhost:8080/sequeira-proj4/rest/user/';

export const getUserInformation = async (token) => {
  try {
    const response = await axios.get(
      hostUrl+'user',
      {
        headers: {
          "Content-Type": "application/json",
          'token': token
        }
      }
    );
    if (response.status === 200) {
      return response.data;
    }
    if (response.status === 401) {
      alert("Token inválido");
      throw new Error("Get user information" + response.status);
    }
  } catch (error) {
    throw new Error("Login failed");
  }
};
