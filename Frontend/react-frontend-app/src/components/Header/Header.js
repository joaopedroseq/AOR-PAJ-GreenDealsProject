import React, { useState, useEffect } from "react";
import "./header.css";
import hambuguer from "../../Assets/icons/hamburger.png";
import logo from "../../Assets/logo/logo.png";
import loginPhoto from "../../Assets/icons/login.png";
import LoginForm from "../LoginForm/LoginForm";
import { logout } from "../../Api/authenticationApi";
import RegisterModal from "../RegisterModal/RegisterModal";
import SellProductModal from "../SellProductModal/SellProductModal";
import Aside from "../Aside/Aside";
import useUserStore from "../../Stores/useUserStore";
import useLocaleStore from "../../Stores/useLocaleStore";
import { Link } from "react-router-dom";
import { getUserLogged } from "../../Api/authenticationApi";
import { useIntl } from "react-intl";
import handleLocaleChange from "../../Handles/handleLocaleChange";
import handleNotification from "../../Handles/handleNotification";
import useWebSocketNotifications from "../../Websockets/useWebSocketNotifications";

const Header = () => {
  //Acesso ao user store para operações que requerem autenticação
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const token = useUserStore((state) => state.token);
  //Opções de língua
  const locale = useLocaleStore((state) => state.locale);
  const intl = useIntl();
  //Preenchimento de campos com o primeiro nome e foto
  const [firstName, setFirstName] = useState(null);
  const [urlPhoto, setUrlPhoto ] = useState(null);
  //Toggle do login form
  const [ showLoginForm, setShowLoginForm] = useState(false);
  //notifications
  const { notificationCount } = useWebSocketNotifications(isAuthenticated);


  
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
          handleNotification(intl, "error", `error${error.message}`);
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
        handleNotification(intl, "success", "goodbye", { firstName });
        useUserStore.getState().clearUserStore();
      }
    } catch (error) {
      console.error("Logout failed:", error);
      handleNotification(intl, "error", `error${error.message}`);
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
    const newLocale = event.target.value;
    handleLocaleChange(newLocale);
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
        <select onChange={handleChangeLanguage} defaultValue={locale}>
        {" "}
        {["en", "pt"].map((language) => (
          <option key={language}>{language}</option>
        ))}{" "}
      </select> 
      </div>
      {/*Logo GreenDeals*/}
      <div className="logo">
          <Link to="/">
            <img className="logo-img" src={logo} alt="logo" />
          </Link>
      </div>

          
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
    <div className="headerDiv">
      <img
        id="loginPhoto"
        className="loginPhoto"
        src={urlPhoto}
        alt="loginPhoto"
      />
    <span className="notificationBadge">{notificationCount}</span>
    </div>
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
              locale={locale}
            />
          </div>
          </>
  )}

          <SellProductModal
            toggleProductModal={toggleProductModal}
            isProductModalVisible={isProductModalVisible}
            token={token}
            locale={locale}
          />
      <Aside
      isAsideVisible={isAsideVisible}/>
      </div>
  );
};

export default Header;