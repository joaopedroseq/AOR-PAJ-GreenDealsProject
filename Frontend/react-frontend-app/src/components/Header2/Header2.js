import React, { useState, useEffect } from "react";
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
import "bootstrap/dist/css/bootstrap.min.css";
import "./header.css";
import { Navbar, Nav, Container, Button, Dropdown, Row, Col, Card, Image, Badge } from "react-bootstrap";


const Header2 = () => {
  //Acesso ao user store para operações que requerem autenticação
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const token = useUserStore((state) => state.token);
  //Opções de língua
  const locale = useLocaleStore((state) => state.locale);
  const intl = useIntl();
  //Preenchimento de campos com o primeiro nome e foto
  const [firstName, setFirstName] = useState(null);
  const [urlPhoto, setUrlPhoto] = useState(null);
  //Toggle do login form
  const [showLoginForm, setShowLoginForm] = useState(false);
  //notifications
  const { notificationCount } = useWebSocketNotifications(isAuthenticated);

  //Toggle do aside (através do botão hamburguer)
  const [isAsideVisible, setAsideVisible] = useState(false);

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
          console.log(userInfo);
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

  useEffect(() => {
    console.log(firstName);
  }, [firstName]);

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
<Navbar expand="lg" className="px-3">
  <Container>
    <Row className="align-items-center w-100 justify-content-between">
      
      {/* Left Section: Hamburger Button & Language Dropdown (Shown on all screens) */}
      <Col xs="auto">
        <Button variant="outline-secondary" onClick={toggleAside}>
          <img src={hambuguer} alt="hamburger" className="hamburger" />
        </Button>
      </Col>

      <Col xs="auto">
        <Dropdown onSelect={(eventKey) => handleLocaleChange(eventKey)}>
          <Dropdown.Toggle variant="secondary">{locale}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="en">English</Dropdown.Item>
            <Dropdown.Item eventKey="pt">Portuguese</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>

      {/* Center Section: Logo (flex-grow-1 ensures balance) */}
      <Col className="text-center flex-grow-1">
        <Link to="/">
          <img className="logo-img" src={logo} alt="logo" />
        </Link>
      </Col>

      {/* Collapsible Dropdown on Small Screens (Only Login Photo is Visible) */}
      <Col xs="auto" className="d-lg-none">
        <Dropdown>
          <Dropdown.Toggle variant="link" className="p-0 border-0">
            <Image src={urlPhoto} alt="loginPhoto" roundedCircle width={40} height={40} />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item as={Link} to="/user">
              {intl.formatMessage({ id: "profileButton" })}
            </Dropdown.Item>
            <Dropdown.Item onClick={toggleProductModal}>
              {intl.formatMessage({ id: "sellProductButton" })}
            </Dropdown.Item>
            {isAuthenticated && (
              <>
                <Dropdown.Item className="text-danger" onClick={handleLogout}>
                  {intl.formatMessage({ id: "logoutButton" })}
                </Dropdown.Item>
                <Dropdown.Item>
                  <Badge bg="danger">{notificationCount}</Badge>
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Col>

      {/* Full Navbar on Large Screens (Hidden on Small Screens) */}
      <Col xs="auto" className="d-none d-lg-block">
        <Button variant="primary" onClick={toggleProductModal}>
          {intl.formatMessage({ id: "sellProductButton" })}
        </Button>
      </Col>

      <Col xs="auto" className="d-none d-lg-block">
        <Link to="/user">
          <Button variant="outline-primary">
            {intl.formatMessage({ id: "profileButton" })}
          </Button>
        </Link>
      </Col>

      {isAuthenticated && (
        <>
          <Col xs="auto" className="d-none d-lg-block">
            <Image src={urlPhoto} alt="loginPhoto" roundedCircle width={50} height={50} />
            <Badge bg="danger" className="ms-2">{notificationCount}</Badge>
          </Col>

          <Col xs="auto" className="d-none d-lg-block">
            <Button variant="danger" onClick={handleLogout}>
              {intl.formatMessage({ id: "logoutButton" })}
            </Button>
          </Col>
        </>
      )}
      
    </Row>
  </Container>
</Navbar>
  )};




export default Header2;