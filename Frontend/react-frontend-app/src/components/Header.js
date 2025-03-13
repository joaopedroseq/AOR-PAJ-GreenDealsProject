import React, { useState } from 'react';
import '../styles/header.css';
import hambuguer from '../assets/icons/hamburger.png'
import logo from '../assets/logo/logo.png'
import loginPhoto from '../assets/icons/login.png'
import LoginForm from './LoginForm';
import useLogin from '../hooks/useLogin';
import RegisterModal from "../components/RegisterModal";


const Header = (props) => {
    const {
        firstName,
        isAuthenticated,
        urlPhoto,
        handleLogout
      } = useLogin();

       // Register modal - toggle its visibility
        const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
      
        const toggleRegisterModal = () => {
        setIsRegisterModalVisible(!isRegisterModalVisible);
        console.log("Modal visibility state changed to:", !isRegisterModalVisible);
        };

    return (
    <div className='Header'>

        {/*Botão hamburger para mostrar aside*/}
        <div className="category-bar" id="category-bar">
            <img src={hambuguer} alt='hamburguer' className="hamburger" id="hamburger"/>
        </div>
        {/*Logo GreenDeals*/}
        <div className="logo">
            <a href='index.html'>
                <img className="logo-img" src={logo} alt='logo'/>
            </a>
        </div>

        {/*Verifica se há um utilizador autenticado para renderizar estes botões, caso contrário não os renderiza*/}
        { isAuthenticated ? (
            <>
        <div className="add-product">
            <input type="button" className="buttonSubmit" id="add-product-btn" value="Vender um produto"></input>
        </div>
        <div className="user-page">
            <input type="button" className="buttonSubmit" id="userAreaBtn" value="Aceder à página pessoal"></input>
        </div>

        {/*Mensagem de boas vindas e botão de logout - não apresentado a menos que utilizador faça login*/}
        <div className="loginMessageDiv" id="loginMessage">
            <h4 className="loginMessage" id="mensagem_boasVindas">bem-vindo {firstName}</h4>

            <form id="logout-form" className="logout-form" onSubmit={handleLogout}>
                <input type="submit" className="buttonSubmit" id="logoutButton" value="logout" size="12px" ></input>
            </form>

            <a href="#">
                <img id="loginPhoto" className="loginPhoto" src={urlPhoto} alt='loginPhoto'/>
            </a>
        </div>
        
        </>
        ) : (
        <>
        {/*Botão de login- não apresentado se o utilizado fizer login*/}
        <div className="login" id="loginButton">
            <img src={loginPhoto}  height="50px"></img>
            <div className="buttons"></div>  
        <LoginForm toggleRegisterModal={toggleRegisterModal}/>
        <RegisterModal toggleModal={toggleRegisterModal} isModalVisible={isRegisterModalVisible} />
        </div>
        </>)
    }


        
        

        

        {/*Modal para adicionar produto - provavelmente mover para assets ou outro component*/}
        <div id="modal-addProduct" className="modal-addProduct" style={{display: 'none'}}>
            {/*Modal content*/}
            <div className="modal-content-addProduct">
                <div className="modal-header-addProduct" id="modal-header-addProduct">
                    <p className="modal-header-addProduct-title">Definir informação do produto</p>
                    <p className="close-addProduct" id="close-addProduct">&times;</p>
                </div>
                <div className="modal-body-addProduct">
                    <form className="add-product-form" id="add-product-form">
                        <div className="add-product-form-field" id="add-product-form-field">
                            <label htmlFor="add-nome">Nome do Produto:</label>
                            <input type="text" id="add-nome" name="add-nome" maxLength="30"></input>
                        </div>
                        <div className="add-product-form-field" id="add-product-form-field">
                            <label htmlFor="add-descricao">Descrição:</label>
                            <input type="text" id="add-descricao" name="add-descricao" maxLength="30"></input>
                        </div>
                        <div className="add-product-form-field" id="add-product-form-field">
                            <label htmlFor="add-preco">Preço do Produto:</label>
                            <input type="text" id="add-preco" name="add-preco" maxLength="10"></input>
                        </div>
                        <div className="add-product-form-field" id="add-product-form-field">
                            <label htmlFor="add-categoria">Categoria do Produto:</label>
                            <select id="add-categoria" name="add-categoria">
                                <option value="vestuario">Vestuário</option>
                                <option value="calcado">Calçado</option>
                                <option value="brinquedos">Brinquedos</option>
                                <option value="viagens">Viagens</option>
                                <option value="papelaria">Papelaria</option>
                            </select>
                        </div>
                        <div className="add-product-form-field" id="add-product-form-field">
                            <label htmlFor="add-localidade">Localização:</label>
                            <input type="text" id="add-localidade" name="add-localidade" maxLength="30"></input>
                        </div>
                        <div className="add-product-form-field" id="add-product-form-field">
                            <label htmlFor="add-imagem">url de imagem:</label>
                            <input type="text" id="add-imagem" name="add-imagem"></input>
                        </div>
                        <input type="button" className="save-addProduct" id="save-addProduct" value="Guardar Alterações"></input>
                    </form>
                </div>
            </div>
        </div> 
        {/*Fim do Modal*/}
    </div>
    );
};

export default Header;