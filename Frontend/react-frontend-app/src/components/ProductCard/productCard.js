import React from "react";
import excludedOverlay from '../../Assets/icons/excludedOverlay.png'
import { Link } from "react-router-dom";

const productCard = ({ product, locale }) => {
  return (
    <Link
      className="grid-item"
      data-category={locale === "pt" ? product.category.nome : product.category.nameEng}
      to={`/detail?id=${product.id}`}
    >
      <img src={product.urlImage} alt={product.name} className="productImage" />
      {product.excluded && <img src={excludedOverlay} className="excluded-overlay" alt="excluido" />}
      <div className="text-overlay">
        <h2>{product.name}</h2>
        <p>Preço: €{product.price}</p>
        <p>Categoria: {locale === "pt" ? product.category.nome : product.category.nameEng}</p>
        <p>Vendedor: {product.seller}</p>
      </div>
    </Link>
  );
};

export default productCard;