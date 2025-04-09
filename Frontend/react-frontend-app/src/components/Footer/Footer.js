import React from 'react';
import './footer.css';
import mobile from '../../Assets/contact/mobile.png'
import email from '../../Assets/contact/email.png'
import facebookIcon from '../../Assets/social/facebook.png'
import instagramIcon from '../../Assets/social/instagram.png'
import linkedinIcon from '../../Assets/social/linkedin.png'
import twitterIcon from '../../Assets/social/twitter.png'
import whatsappIcon from '../../Assets/social/whatsapp.png'
import youtubeIcon from '../../Assets/social/youtube.png'

const Footer = (props) => {
    return (
        <div className="footer">
            <div className="footerContainer">
                <div className="footerInfo">
                    <h3>Contactos</h3>
                        <ul className="listaContactos">
                            <li><p>Departamento de Engenharia Informática</p></li>
                            <li><p>Faculdade de Ciências e Tecnologia</p></li>
                            <li><p>Universidade de Coimbra</p></li>
                            <li><p>Pólo II - Pinhal de Marrocos</p></li>
                            <li><p>3030-290 Coimbra</p></li>
                            <div className="contact">
                                <img src={mobile} height="30px" style={{padding: '5px'}}/>
                                <p>+351 239 790 000</p>
                            </div>
                        <div className="contact">
                            <img src={email} height="30px" style={{padding: '5px'}}/>
                            <p>info@dei.uc.pt</p>
                        </div>
                        </ul>
            </div>
            <div className="footerInfo">
                <h3>Apoio ao cliente</h3>
                    <ul className="listaApoioCliente">
                        <li><a >FAQ</a></li>
                        <li><a href="#" id="privacyButton">Politica de Privacidade</a></li>
                        <li><a >Termos de serviço</a></li> 
                    </ul>
            </div>
            <div className="footerInfo">
                <h3>Sobre nós</h3>
                <ul className="listaEmpresa">
                    <li><a href="#" id="aboutButton">Créditos</a></li>
                    <li><a >Missão e valores da empresa</a></li>
                    <li><a >Oportunidades de emprego</a></li>
                </ul>
            </div>
            <div className="social">
                <h3>Siga-nos</h3>
                <div className="listaSocial">
                    <a href="https://www.facebook.com" target="_blank"><img src={facebookIcon} height="40px"/></a>
                    <a href="https://www.instagram.com" target="_blank"><img src={instagramIcon} height="40px"/></a>
                    <a href="https://www.linkedin.com" target="_blank"><img src={linkedinIcon} height="40px"/></a>
                    <a href="https://www.twitter.com" target="_blank"><img src={twitterIcon} height="40px"/></a>
                    <a href="https://www.youtube.com" target="_blank"><img src={youtubeIcon} height="40px"/></a>
                </div>
            </div>
        </div>
        <div className="copyright">
            &copy; 2025 GreenDeals. Todos os direitos reservados.
        </div>
    </div>
    );
};

export default Footer;