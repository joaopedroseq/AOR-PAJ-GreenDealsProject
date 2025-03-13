import { useState, useEffect } from "react";
import { userStore } from "../stores/userStore";
import { login, logout } from "../services/authenticationService";
import { getUserInformation } from "../services/userService";

const useLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const updateUsername = userStore((state) => state.updateUsername);
  const updateToken = userStore((state) => state.updateToken);
  const updateIsAuthenticated = userStore((state) => state.updateIsAuthenticated);
  const updateIsAdmin = userStore((state) => state.updateIsAdmin);
  const updateUrlPhoto = userStore((state) => state.updateUrlPhoto);
  const updateFirstName = userStore((state) => state.updateFirstName);

  const isAuthenticated = userStore((state) => state.isAuthenticated);
  const firstName = userStore((state) => state.firstName);
  const urlPhoto = userStore((state) => state.urlPhoto);
  const token = userStore((state) => state.token);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      alert(
        "Para fazer login terá de preencher os campos de utilizador bem como a password"
      );
    } else {
      try {
        const token = await login(username, password);
        if (token !== null) {
          await logUserInformation(token);
        }
      } catch (error) {
        alert("Login falhou");
        console.error("Login failed:", error);
      }
    }
  };

  const logUserInformation = async (token) => {
    console.log(token);
    try {
      const userInformation = await getUserInformation(token);
      updateUsername(userInformation.username);
      updateToken(token);
      updateIsAuthenticated();
      updateIsAdmin(userInformation.admin);
      updateUrlPhoto(userInformation.url);
      updateFirstName(userInformation.firstName);
    } catch (error) {
      console.error("Failed to get user information:", error);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
        const isLoggedOut = await logout(token);
        if (isLoggedOut) {
          userStore.getState().clearUserStore();
          alert("Logout com sucesso");
          window.href="/index";
        }
      } catch (error) {
        alert("Logout falhou");
        console.error("Logout failed:", error);
      }
    };

  useEffect(() => {
    if (isAuthenticated) {
      // para adicionar novas funcionalides
    }
  }, [isAuthenticated]);

  return {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin,
    handleLogout,
    isAuthenticated,
    firstName,
    urlPhoto
  };
};

export default useLogin;