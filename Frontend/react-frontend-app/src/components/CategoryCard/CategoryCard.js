import React from "react";
import excludeIcon from "../../assets/icons/exclude.png";

const CategoryCard = ({ category, onDelete }) => {
  let numberOfProducts;
  if (category.products != null) {
    numberOfProducts = category.products.length;
  } else {
    numberOfProducts = 0;
  }

  return (
    <div className="category-card">
      <div className="category-info">
        <p className="category-name">{category.name}</p>
        <p className="category-numberOfProducts">
          Nº produtos: {numberOfProducts}
        </p>
        <img
          src={excludeIcon}
          alt="exclude category"
          className="remove-category-button"
          onClick={onDelete}
          data-category-numberofproducts={numberOfProducts}
          data-category-name={category.name}
        />
      </div>
    </div>
  );
};

export default CategoryCard;
