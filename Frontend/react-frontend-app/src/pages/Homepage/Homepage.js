import React, { useState, useEffect } from "react";
import "./homepage.css";
import leaf from "../../Assets/icons/leaf.png";
import placeholder from '../../Assets/placeholder/item.png';
import sustentabilityBanner from "../../Assets/banners/banner.png";
import ProductCard from "../../Components/ProductCard/productCard";
import useProductStore from "../../Stores/useProductStore";
import useUserStore from "../../Stores/useUserStore";
import useLocaleStore from "../../Stores/useLocaleStore";
import { FormattedMessage } from "react-intl";


//Homepage
const Homepage = () => {
  const products = useProductStore((state) => state.products);
  const filters = useProductStore((state) => state.filters);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const { setFilters, clearFilters } = useProductStore(); //talvez seja ainda necessário

  //Opções de língua
  const locale = useLocaleStore((state) => state.locale);

  //Popular a página com produtos
  useEffect(() => {
    clearFilters()
    fetchProducts(); // Fetch products on component mount
  }, []);


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
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
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