import React, { useState, useEffect } from "react";
import "./homepage.css";
import leaf from "../../assets/icons/leaf.png";
import placeholder from '../../assets/placeholder/item.png';
import sustentabilityBanner from "../../assets/banners/banner.png";
import { getProducts } from "../../api/productApi";
import ProductCard from "../../components/ProductCard/productCard";
import { showErrorToast } from "../../Utils/ToastConfig/toastConfig";
import { useCategoriesStore } from "../../stores/useCategoriesStore";
import useProductStore from "../../stores/useProductStore";
import errorMessages from "../../Utils/constants/errorMessages";


const Homepage = () => {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, [fetchProducts]);


  return (
    <div className="main-content-index">
      <div className="main-title">
        <img src={leaf} style={{ rotate: "45deg" }} alt='leaf sustainability icon'/>
        <h4>GreenDeals</h4>
      </div>
      <div className="mission-statement">
        <p>
          Na <em>GreenDeals</em> acreditamos que a sustentabilidade começa com
          pequenas ações que fazem uma grande diferença. <br />
          Oferecemos um ambiente virtual onde você pode vender itens que já não
          utiliza e encontrar produtos usados de qualidade a preços acessíveis.{" "}
          <br />
          Ao reutilizar bens, contribuímos para a redução do desperdício e
          promovemos um consumo mais consciente.
        </p>
      </div>
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