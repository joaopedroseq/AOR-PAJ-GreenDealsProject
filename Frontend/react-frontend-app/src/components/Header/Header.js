import React, { useState, useEffect } from "react";
import "./header.css";
import hambuguer from "../../assets/icons/hamburger.png";
import logo from "../../assets/logo/logo.png";
import loginPhoto from "../../assets/icons/login.png";
import LoginForm from "../LoginForm/LoginForm";
import { logout } from "../../api/authenticationApi";
import {
  showSuccessToast,
  showErrorToast,
} from "../../Utils/ToastConfig/toastConfig";
import RegisterModal from "../RegisterModal/RegisterModal";
import SellProductModal from "../SellProductModal/SellProductModal";
import Aside from "../Aside/Aside";
import { userStore } from "../../stores/UserStore";
import { Link } from "react-router-dom";
import { getUserLogged } from "../../api/userApi";
import errorMessages from "../../Utils/constants/errorMessages";

const Header = () => {
  const isAuthenticated = userStore((state) => state.isAuthenticated);
  const token = userStore((state) => state.token);

  const [firstName, setFirstName] = useState(null);
  const [urlPhoto, setUrlPhoto ] = useState(null);

  // Edit product modal - toggle its visibility
    const [isAsideVisible, setAsideVisible] =
      useState(false);
  
    const toggleAside = () => {
      setAsideVisible(!isAsideVisible);
    };

  useEffect(() => {
    if (isAuthenticated) {
      const getUserInfo = async () => {
        try {
          const userInfo = await getUserLogged(token);
          setFirstName(userInfo.firstName);
          setUrlPhoto(userInfo.url);
        } catch (error) {
          console.error("Failed to get user information:", error);
        }
      };
      getUserInfo();
    }
  }, [isAuthenticated, token]);

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const isLoggedOut = await logout(token);
      if (isLoggedOut) {
        showSuccessToast("Até à próxima " + firstName);
        userStore.getState().clearUserStore();
      }
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
    }
  };

  // Register modal - toggle its visibility
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  const toggleRegisterModal = () => {
    setIsRegisterModalVisible(!isRegisterModalVisible);
  };

  // Product modal - toggle its visibility
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);

  const toggleProductModal = () => {
    setIsProductModalVisible(!isProductModalVisible);
  };

  return (
    <div className="Header">
      {/*Botão hamburger para mostrar aside*/}
      <div className="category-bar" id="category-bar">
        <img
          src={hambuguer}
          alt="hamburguer"
          className="hamburger"
          id="hamburger"
          onClick={toggleAside}
        />
      </div>
      {/*Logo GreenDeals*/}

      <div className="logo">
        <nav>
          <Link to="/">
            <img className="logo-img" src={logo} alt="logo" />
          </Link>
        </nav>
      </div>

      {/*Verifica se há um utilizador autenticado para renderizar estes botões, caso contrário não os renderiza*/}
      {isAuthenticated ? (
        <>
          <div className="add-product">
            <input
              type="button"
              className="buttonSubmit"
              id="add-product-btn"
              value="Vender um produto"
              onClick={toggleProductModal}
            ></input>
          </div>
          <div className="user-page">
            <input
              type="button"
              className="buttonSubmit"
              id="userAreaBtn"
              value="Aceder à página pessoal"
            ></input>
          </div>

          {/*Mensagem de boas vindas e botão de logout - não apresentado a menos que utilizador faça login*/}
          <div className="loginMessageDiv" id="loginMessage">
            <h4 className="loginMessage" id="mensagem_boasVindas">
              bem-vindo {firstName}
            </h4>

            <form
              id="logout-form"
              className="logout-form"
              onSubmit={handleLogout}
            >
              <input
                type="submit"
                className="buttonSubmit"
                id="logoutButton"
                value="logout"
                size="12px"
              ></input>
            </form>

              <img
                id="loginPhoto"
                className="loginPhoto"
                src={urlPhoto}
                alt="loginPhoto"
              />
          </div>
          <SellProductModal
            toggleProductModal={toggleProductModal}
            isProductModalVisible={isProductModalVisible}
            token={token}
          />
        </>
      ) : (
        <>
          {/*Botão de login- não apresentado se o utilizado fizer login*/}

          <div className="login" id="loginButton">
            <img src={loginPhoto} height="50px" alt='user logged'></img>
            <div className="buttons"></div>
            <LoginForm toggleRegisterModal={toggleRegisterModal} />
            <RegisterModal
              toggleModal={toggleRegisterModal}
              isModalVisible={isRegisterModalVisible}
            />
          </div>
        </>
      )}
      <Aside
      isAsideVisible={isAsideVisible}/>
    </div>
  );
};

export default Header;
