import { useState, useEffect } from "react";
import useLogin from "../hooks/useLogin";
import { checkIfValid } from "../utils";
import { registerUser } from "../api/userApi";

const useRegister = () => {
  const { setUsername, setPassword, handleLogin } = useLogin();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [url, setUrl] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    if (firstName.trim() === "") {
      alert("O primeiro nome é um campo de preenchimento obrigatório");
    } else if (lastName.trim() === "") {
      alert("O apelido é obrigatório.");
    } else if (newUsername.trim() === "") {
      alert("O username é de preenchimento obrigatório");
    } else if (!checkIfValid(newUsername)) {
      alert("O username não pode conter espaços nem caractéres especiais");
    } else if (newPassword.trim() === "") {
      alert("A password é de preenchimento obrigatório");
    } else if (passwordConfirm.trim() === "") {
      alert("A confirmação da sua password é obrigatória");
    } else if (newPassword !== passwordConfirm) {
      alert("As passwords não correspondem");
    } else if (email.trim() === "") {
      alert("O email é de preenchimento obrigatório");
    } else if (!email.includes("@")) {
      alert("O Email deve conter '@'.");
    } else if (phoneNumber.trim() === "") {
      alert("O número de telefone é obrigatório");
    } else if (!/^\d{9}$/.test(phoneNumber)) {
      alert("O número de telefone deve ter 9 dígitos.");
    } else if (url.trim() === "") {
      alert("A fotografia de perfil é obrigatória");
    } else {
      var confirm = window.confirm(
        "Pretende criar um novo registo " + firstName + "?"
      );
      if (confirm) {
        const newUser = {
          username: newUsername,
          password: newPassword,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          url: url,
        };
        console.log(newUser);
        try {
          const response = await registerUser(newUser);
          if (response != null) {
            setUsername(newUser.username);
            setPassword(newUser.password);
            await handleLogin(event);
          }
        } catch (error) {
          alert("Registo falhou");
          console.error("Registering failed:", error);
        }
      }
    }
  };
  return {
    setFirstName,
    setLastName,
    setNewUsername,
    setNewPassword,
    setPasswordConfirm,
    setEmail,
    setPhoneNumber,
    setUrl,
    handleRegister
  };
};

export default useRegister;