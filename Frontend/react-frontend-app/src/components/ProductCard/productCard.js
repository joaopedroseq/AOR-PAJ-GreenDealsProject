import React from "react";
import excludedOverlay from '../../Assets/icons/excludedOverlay.png'
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";

const ProductCard = ({ product, locale }) => {
  const intl = useIntl();

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
        <p>{intl.formatMessage({ id: "productCardPrice" }, { price: product.price })}</p>
        <p>{intl.formatMessage({ id: "productCardCategory" }, { category: locale === "pt" ? product.category.nome : product.category.nameEng })}</p>
        <p>{intl.formatMessage({ id: "productCardSeller" }, { seller: product.seller })}</p>
      </div>
    </Link>
  );
};

export default ProductCard;