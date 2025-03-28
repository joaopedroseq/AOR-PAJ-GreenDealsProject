import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link className="grid-item"
      data-category={product.category} to={`/detail?id=${product.id}`}>
      <img src={product.urlImage} alt={product.name} />
      {product.excluded && <div className="excluded-overlay"></div>}
      <div className="text-overlay">
        <h2>{product.name}</h2>
        <p>Preço: €{product.price}</p>
        <p>Categoria: {product.category}</p>
        <p>Vendedor: {product.seller}</p>
      </div>
    </Link>
  );
};

export default ProductCard;