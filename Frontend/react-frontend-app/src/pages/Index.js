import React from 'react';
import '../styles/index.css';
import leaf from '../assets/icons/leaf.png'
import sustentabilityBanner from '../assets/banners/banner.png'


const Index = (props) => {
    return (
        <div className="main-content-index">
            <div className="main-title">
                <img src={leaf} style={{rotate: '45deg'}}/>
                <h4>GreenDeals</h4>
            </div>
                <div className="mission-statement">
                    <p>Na<em>GreenDeals</em> acreditamos que a sustentabilidade começa com pequenas ações
                        que fazem uma grande diferença. <br/>
                        Oferecemos um ambiente virtual onde você pode vender itens que já não utiliza e
                        encontrar produtos usados de qualidade a preços acessíveis. <br/>
                        Ao reutilizar bens, contribuímos para a redução do desperdício e promovemos um consumo mais consciente.
                    </p>
                </div>
            {/*Banners do site*/}
            <div className="grid-container"  id="grid-container"></div>
            <div className="sustentabilityBannerSpan">
                <img className="sustentabilityBanner" id="sustentabilityBanner" src={sustentabilityBanner}
                    alt="barra de produtos sustentaveis"/>
            </div>

            {/*Janela modal de registo*/}
            <div id="modal-register" className="modal-register">
                <div className="modal-content-id">
                    {/*Header do modal*/}
                    <div className="modal-header-id" id="modal-header-id">
                        <p className="modal-header-id-title">Criar novo registo</p>
                        <p className="close-id" id="close-id">&times;</p>
                    </div>
                    {/*Body do modal*/}
                    <div className="modal-body-id">
                        <form className="edit-id-form" id="edit-id-form">
                            <div className="edit-id-form-field" id="edit-id-form-field">
                                <label htmlFor="edit-nome">Primeiro Nome:</label>
                                <input type="text" id="new-name" name="new-name" maxLength="20"/>
                            </div>
                            <div className="edit-id-form-field" id="edit-id-form-field">
                                <label htmlFor="edit-ultimoNome">Último Nome:</label>
                                <input type="text" id="new-lastname" name="new-lastname" maxLength="20"/>
                            </div>
                            <div className="edit-id-form-field" id="edit-id-form-field">
                                <label htmlFor="edit-username">Username:</label>
                                <input type="text" id="new-username" name="new-username" maxLength="30"/>
                            </div>
                            <div className="edit-id-form-field" id="edit-id-form-field">
                                <label htmlFor="edit-password">Password:</label>
                                <input type="password" id="new-password" name="new-password" maxLength="30"/>
                            </div>
                            <div className="edit-id-form-field" id="edit-product-form-field">
                                <label htmlFor="edit-passwordConfirm">Confirmar Password:</label>
                                <input type="password" id="new-passwordConfirm" name="new-passwordConfirm" maxLength="30"/>
                            </div>
                            <div className="edit-id-form-field" id="edit-id-form-field">
                                <label htmlFor="edit-email">Email:</label>
                                <input type="text" id="new-email" name="new-email" maxLength="40"/>
                            </div>
                            <div className="edit-id-form-field" id="edit-id-form-field">
                                <label htmlFor="edit-phone">Número de Telefone:</label>
                                <input type="text" id="new-phone" name="new-phone" maxLength="20"/>
                            </div>
                            <div className="edit-id-form-field" id="edit-id-form-field">
                                <label htmlFor="edit-photo">Fotografia de Perfil (URL):</label>
                                <input type="url" id="new-photo" name="new-photo" placeholder="URL da imagem"/>
                            </div>
                            <input type="button" id="registerBtn" className="registerBtn" value="Register"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;