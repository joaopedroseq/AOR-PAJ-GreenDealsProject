import React from "react";
import excludedOverlay from '../../assets/icons/excludedOverlay.png'
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  //Cartão de Produto - para popular diferentes páginas
  return (
    <Link className="grid-item"
      data-category={product.category} to={`/detail?id=${product.id}`}>
      <img src={product.urlImage} alt={product.name} className="productImage"/>
      {product.excluded && <img src={excludedOverlay} className="excluded-overlay" alt="excluido"></img>}
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