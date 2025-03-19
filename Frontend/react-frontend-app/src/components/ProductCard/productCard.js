import React from "react";
import "../../pages/Homepage/homepage.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    
    <div
      className="grid-item"
      data-category={product.category}
    >
      <Link to={`/detail?id=${product.id}`}>
      <img src={product.urlImage} alt={product.name} />
      {product.excluded && <div className="excluded-overlay"></div>}
      <div className="text-overlay">
        <h2>{product.name}</h2>
        <p>Preço: €{product.price}</p>
        <p>Categoria: {product.category}</p>
      </div>
    </Link>
    </div>
  );
};

export default ProductCard;