import React, { useState, useEffect } from "react";
import "./header.css";
import hambuguer from "../../Assets/icons/hamburger.png";
import logo from "../../Assets/logo/logo.png";
import loginPhoto from "../../Assets/icons/login.png";
import LoginForm from "../LoginForm/LoginForm";
import { logout } from "../../Api/authenticationApi";
import {
  showSuccessToast,
  showErrorToast,
} from "../../Utils/ToastConfig/toastConfig";
import RegisterModal from "../RegisterModal/RegisterModal";
import SellProductModal from "../SellProductModal/SellProductModal";
import Aside from "../Aside/Aside";
import useUserStore from "../../Stores/useUserStore";
import { Link } from "react-router-dom";
import { getUserLogged } from "../../Api/authenticationApi";
import errorMessages from "../../Utils/constants/errorMessages";
import { FormattedMessage, useIntl } from "react-intl";

const Header = () => {
  //Acesso ao user store para operações que requerem autenticação
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const token = useUserStore((state) => state.token);
  //Opções de língua
  const locale = useUserStore((state) => state.locale);
  const updateLocale = useUserStore((state) => state.updateLocale);
  const intl = useIntl();
  //Preenchimento de campos com o primeiro nome e foto
  const [firstName, setFirstName] = useState(null);
  const [urlPhoto, setUrlPhoto ] = useState(null);
  //Toggle do login form
  const [ showLoginForm, setShowLoginForm] = useState(false);

  //Toggle do aside (através do botão hamburguer)
    const [isAsideVisible, setAsideVisible] =
      useState(false);
  
    const toggleAside = () => {
      setAsideVisible(!isAsideVisible);
    };

  //Após alteração do estado de autenticação, faz fetch das informações do utilizador
  //para costumização de elementos do header (nome e foto)
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

  //operação de logout - chamada ao cleardo user store
  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const isLoggedOut = await logout(token);
      if (isLoggedOut) {
        showSuccessToast(`${intl.formatMessage({ id: 'goodbye' }, { firstName: firstName })}`);
        useUserStore.getState().clearUserStore();
      }
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
    }
  };

  // Modal de Registo de novo utilizador
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  const toggleRegisterModal = () => {
    setIsRegisterModalVisible(!isRegisterModalVisible);
  };

  // Modal de Vender novo produto
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);

  const toggleProductModal = () => {
    setIsProductModalVisible(!isProductModalVisible);
  };

  //Mudança de lingua
  const handleChangeLanguage = (event) => {
    updateLocale(event.target.value);
  }

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
        <select onChange={handleChangeLanguage} defaultValue={locale}>
        {" "}
        {["en", "pt"].map((language) => (
          <option key={language}>{language}</option>
        ))}{" "}
      </select> 
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
          <div className="headerDiv">
              <input
                type="button"
                className="sellProductButton"
                id="add-product-btn"
                value={intl.formatMessage({ id: 'sellProductButton' })}
                onClick={toggleProductModal}
              ></input>
            </div>
          <div className="headerDiv">
            <Link to="/user">
              <input
                type="button"
                className="userPageButton"
                id="userAreaBtn"
                value={intl.formatMessage({ id: 'profileButton' })}
              />
            </Link>
          </div>
          <div className="headerDiv">            
              <input
                type="submit"
                className="logoutButton"
                id="logoutButton"
                value={intl.formatMessage({ id: 'logoutButton' })}
                size="12px"
                onClick={handleLogout}
              ></input>
            </div>

          {/*Mensagem de boas vindas e botão de logout - não apresentado a menos que utilizador faça login*/}
            <div className="headerDiv">
            <h4 className="loginMessage" id="mensagem_boasVindas">
            <FormattedMessage id="welcomeMessage"/> {firstName}
            </h4>
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
          {/*Botão de login- não apresentado se o utilizado fizer login
          é também utilizado para mostrar o login form*/}
          <div className="login" id="loginButton">
            <img src={loginPhoto} height="50px" alt='user logged'
            onClick={() => {
              setShowLoginForm(!showLoginForm);
            }}/>
            <div className="buttons"></div>
            <LoginForm
            isOpen={showLoginForm}
            isClosed={() => setShowLoginForm(false)}
            toggleRegisterModal={toggleRegisterModal}/>
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