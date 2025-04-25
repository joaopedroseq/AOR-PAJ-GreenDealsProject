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
import { useIntl } from "react-intl";

const Footer = (props) => {
    const intl = useIntl();

    return (
        <div className="footer">
            <div className="footerContainer">
                <div className="col-sm-3">
                    <div className="footerInfo">
            <h3>{intl.formatMessage({ id: "footerContactsTitle" })}</h3>
                        <ul className="listaContactos">
                <li><p>{intl.formatMessage({ id: "footerContactsDepartment" })}</p></li>
                <li><p>{intl.formatMessage({ id: "footerContactsFaculty" })}</p></li>
                <li><p>{intl.formatMessage({ id: "footerContactsUniversity" })}</p></li>
                <li><p>{intl.formatMessage({ id: "footerContactsLocation" })}</p></li>
                <li><p>{intl.formatMessage({ id: "footerContactsPostalCode" })}</p></li>
                            <div className="contact">
                                <img src={mobile} height="30px" style={{ padding: '5px' }} />
                <p>+351 239 790 000</p>
                </div>
                            <div className="contact">
                                <img src={email} height="30px" style={{ padding: '5px' }} />
                <p>info@dei.uc.pt</p>
                </div>
            </ul>
                    </div>
                </div>

                <div className="col-sm-3">
                    <div className="footerInfo">
            <h3>{intl.formatMessage({ id: "footerCustomerSupportTitle" })}</h3>
                        <ul className="listaApoioCliente">
                            <li><a>{intl.formatMessage({ id: "footerFAQ" })}</a></li>
                            <li><a href="#" id="privacyButton">{intl.formatMessage({ id: "footerPrivacyPolicy" })}</a></li>
                            <li><a>{intl.formatMessage({ id: "footerTermsOfService" })}</a></li> 
            </ul>
                    </div>
                </div>

                <div className="col-sm-3">
                    <div className="footerInfo">
            <h3>{intl.formatMessage({ id: "footerAboutUsTitle" })}</h3>
                        <ul className="listaEmpresa">
                            <li><a href="#" id="aboutButton">{intl.formatMessage({ id: "footerCredits" })}</a></li>
                            <li><a>{intl.formatMessage({ id: "footerMissionAndValues" })}</a></li>
                            <li><a>{intl.formatMessage({ id: "footerJobOpportunities" })}</a></li>
            </ul>
                    </div>
                </div>
                <div className="col-sm-3">
                    <div className="social">
                        <h3>{intl.formatMessage({ id: "footerFollowUsTitle" })}</h3>
                        <div className="listaSocial">
                            <a href="https://www.facebook.com" target="_blank"><img src={facebookIcon} height="40px" /></a>
                            <a href="https://www.instagram.com" target="_blank"><img src={instagramIcon} height="40px" /></a>
                            <a href="https://www.linkedin.com" target="_blank"><img src={linkedinIcon} height="40px" /></a>
                            <a href="https://www.twitter.com" target="_blank"><img src={twitterIcon} height="40px" /></a>
                            <a href="https://www.youtube.com" target="_blank"><img src={youtubeIcon} height="40px" /></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="copyright">
                &copy; 2025 GreenDeals. {intl.formatMessage({ id: "footerCopyrightText" })}
            </div>
        </div>
    );
};

export default Footer;