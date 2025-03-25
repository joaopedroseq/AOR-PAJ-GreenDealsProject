import React, { useEffect, useState } from "react";
import "./aside.css";
import { useLocation } from "react-router-dom";
import useProductStore from "../../stores/useProductStore";
import { useCategoriesStore } from "../../stores/useCategoriesStore";
import userStore from "../../stores/UserStore";
import { getUserInformation } from "../../hooks/handleLogin";

const Aside = ({ isAsideVisible }) => {
  const token = userStore((state) => state.token);
  const [ isAdmin, setIsAdmin ] = useState(false);
  const page = useLocation().pathname;
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const { setFilters } = useProductStore();

  useEffect(() => {
    const getUserInfo = async () => {
      let userInfo = await getUserInformation(token);
      if (userInfo.admin) {
        setIsAdmin(true);
      }
    };
    if(page === '/user'){
      getUserInfo();
    }
    fetchCategories();
  }, [fetchCategories, page]);

  const handleCategoryClick = (category) => {
    setFilters({ category });
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      id="aside-menu"
      style={{ display: isAsideVisible ? "block" : "none" }}
    >
      {(page === "/" || page === "/user") && (
        <ul>
          {page === "/" && (
            <>
              <h3>Categorias</h3>
            </>
          )}
          {page === "/user" && (
            <>
              <h2 onClick={() => handleScrollToSection("products-section")}>
                Produtos
              </h2>
              <h3>Categorias</h3>
            </>
          )}
          <li
            id="category"
            value="all"
            onClick={() => handleCategoryClick(null)}
          >
            Todos os produtos
          </li>
          {categories.map((category, index) => (
            <li
              key={index}
              value={category}
              id={category}
              onClick={() => handleCategoryClick(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </li>
          ))}
          {page === "/user" && (
            <h2 onClick={() => handleScrollToSection("profile-section")}>
              {" "}
              Informações
            </h2>
          )}
          {(page === "/user" && isAdmin) && (
            <h2>Página de Administrador</h2>
          )}
        </ul>
      )}
    </aside>
  );
};
export default Aside;
