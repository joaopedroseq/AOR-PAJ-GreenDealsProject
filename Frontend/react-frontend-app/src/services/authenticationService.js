import axios from 'axios';
import { apiBaseUrl } from "../config";
//axios - ordem: url, body, headers

const userAutenticationEndpoint = `${apiBaseUrl}user/`;

//Função para login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${userAutenticationEndpoint}login`, {
      username: username,
      password: password,
    }, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if(response.status === 200){
      return response.data;
    }
    if(response.status === 400){
      alert('Falha no login por falta de dados');
      return null;
    }
    if(response.status === 401){
      alert('Nome de utilizador ou palavra-passe incorretos. Por favor, verifique os seus dados e tente novamente.');
      return null;
    }
  } catch (error) {
    throw new Error('Login failed');
  }
}


//Função para logout
export const logout = async (token) => {
  console.log("logout token:" + token)
  try {
    const response = await axios.post(`${userAutenticationEndpoint}logout`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      }
    );
    if (response.status === 200) {
      return true;
    }
    if (response.status === 401) {
      alert("Token inválido");
      return false;
    }
  } catch (error) {
    throw new Error("Logout failed");
  }
};
