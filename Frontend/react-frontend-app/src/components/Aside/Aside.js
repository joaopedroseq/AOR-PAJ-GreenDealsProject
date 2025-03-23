import React, { useEffect, useState } from "react";
import "./aside.css";
import useProductStore from "../../stores/useProductStore";
import { useCategoriesStore } from "../../stores/useCategoriesStore";

const Aside = ({ isAsideVisible }) => {
    const categories = useCategoriesStore((state) => state.categories)
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  //Filtering products
  const { setFilters } = useProductStore();
  
  const handleCategoryClick = (category) => {
    console.log(category);
    setFilters({ category });
  };

  return (
    <aside
      id="aside-menu"
      style={{ display: isAsideVisible ? "block" : "none" }}
    >
      <ul>
        <h3>Categorias</h3>
        <li id="category" value="all" onClick={() => handleCategoryClick(null)}>
          Todos os produtos
        </li>
        {categories.map((category, index) => (
          <li key={index}
          value={category}
          id={category}
          onClick={() => handleCategoryClick(category)}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </li>
        ))}
      </ul>
    </aside>
  );
};
export default Aside;
