import React, {  useState, useEffect } from "react";
import "./homepage.css";
import leaf from "../../Assets/icons/leaf.png";
import placeholder from '../../Assets/placeholder/item.png';
import sustentabilityBanner from "../../Assets/banners/banner.png";
import ProductCard from "../../Components/ProductCard/ProductCard";
import useProductStore from "../../Stores/useProductStore";
import useLocaleStore from "../../Stores/useLocaleStore";
import { FormattedMessage } from "react-intl";
import useWebSocketProducts from "../../Websockets/useWebSocketProducts";
import UserCard from "../../Components/UserCard/UserCard";
import handleGetAllUsers from "../../Handles/handleGetAllUsers";
import { useIntl } from "react-intl";


//Homepage
const Homepage = () => {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const { clearFilters } = useProductStore(); //talvez seja ainda necessário

  //Users
  const [allUsers, setAllUsers] = useState([]);

  //Opções de língua
  //Internacionalização
  const intl = useIntl();
  const locale = useLocaleStore((state) => state.locale);

  //WebSocketProducts
  // WebSocket for real-time product updates
  const { websocketProducts } = useWebSocketProducts();

  //Popular a página com produtos
  useEffect(() => {
    const gatherInformation = async() => {
      clearFilters();
      await fetchProducts(); // Fetch products on component mount
      const users = await handleGetAllUsers(null, intl);
      console.log(users);
      setAllUsers(users);
    };
    gatherInformation();    
  }, [clearFilters, fetchProducts, intl]);

  return (
    <div className="main-content-index">
      <div className="main-title">
        <img src={leaf} style={{ rotate: "45deg" }} alt='leaf sustainability icon'/>
        <h4>GreenDeals</h4>
      </div>
        <p className="mission-statement">
        <FormattedMessage id="missionStatement"/> 
        </p>
      {/*Banners do site*/}
      <div className="grid-container">
        {products.length === 0 ? (
          <div className="grid-item no-products">
            <img
              src={placeholder}
              alt="No products available"
            />
            <div className="text-overlay">
              <h2>No Products Available</h2>
              <p>Please check back later.</p>
            </div>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))
        )}
      </div>
      <section className="homepage-user-section" id="homepage-user-section">
        <div id="homepage-user-container" className="homepage-user-container">
          {allUsers.length === 0 ? (
            <p>{intl.formatMessage({ id: "noUsersToShow"})}</p>
          ) : (
            allUsers.map((user, index) => (
              <UserCard
                key={user.id || index}
                user={user}
              />
            ))
          )}
        </div>
      </section>
      <div className="sustentabilityBannerSpan">
        <img
          className="sustentabilityBanner"
          id="sustentabilityBanner"
          src={sustentabilityBanner}
          alt="barra de produtos sustentaveis"
        />
      </div>
    </div>
  );
};
export default Homepage;