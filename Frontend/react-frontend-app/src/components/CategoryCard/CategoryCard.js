import React from "react";
import { Link } from "react-router-dom";
import excludeIcon from "../../assets/icons/exclude.png";

const CategoryCard = ({ category }) => {
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
          //data-category-numberofproducts={numberOfProducts} poderá talvez apagar-se
          //data-category-name={category.name} poderá talvez apagar-se
        />
      </div>
    </div>
  );
};

export default CategoryCard;
