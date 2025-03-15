import React from 'react';
import './index.css';
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
        </div>
    );
};

export default Index;