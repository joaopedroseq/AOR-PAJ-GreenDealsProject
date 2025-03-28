import React, { useEffect, useState } from "react";
import "./aside.css";
import { useLocation } from "react-router-dom";
import useProductStore from "../../stores/useProductStore";
import { useCategoriesStore } from "../../stores/useCategoriesStore";
import useUserStore from "../../stores/useUserStore";
import { getLoggedUserInformation } from "../../Handles/handleLogin";
import { Link } from "react-router-dom";

const Aside = ({ isAsideVisible }) => {
  const token = useUserStore((state) => state.token);
  const [isAdmin, setIsAdmin] = useState(false);
  const page = useLocation().pathname;
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const { setFilters, fetchProducts } = useProductStore();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        let userInfo = await getLoggedUserInformation(token);
        if (userInfo.admin) {
          setIsAdmin(true);
        }
      } catch (error) {}
    };
    if (page === "/user") {
      getUserInfo();
    }
    if (page === "/admin") {
      getUserInfo();
    }
    fetchCategories();
  }, [fetchCategories, page]);

  useEffect(() => {
    console.log("isAdmin state updated:", isAdmin);
  }, [isAdmin]);

  const handleCategoryClick = (category, edited) => {
    if (category) {
      setFilters({ category: category.name });
    } else {
      setFilters({ category: null });
    }
    if(edited) {
      setFilters({ edited: true });
    }
    if (page === "/admin" || page === "/user") {
      fetchProducts(token);
    } else {
      fetchProducts();
    }
  };

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView();
    }
  };

  return (
    <aside
      data-testid="aside-menu"
      id="aside-menu"
      style={{ display: isAsideVisible ? "block" : "none" }}
    >
      {page === "/" && (
        <ul>
          <h3>Categorias</h3>
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
              value={category.name}
              id={category.name}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </li>
          ))}
        </ul>
      )}
      {page === "/user" && (
        <ul>
          <h2 onClick={() => handleScrollToSection("products-section")}>
            Produtos
          </h2>
          <h3>Categorias</h3>
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
              value={category.name}
              id={category.name}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </li>
          ))}
        </ul>
      )}
      {page === "/user" && (
        <h2 onClick={() => handleScrollToSection("profile-section")}>
          Informações
        </h2>
      )}
      {page === "/user" && isAdmin && (
        <Link to="/admin" className="link">
          <h2>Página de Administrador</h2>
        </Link>
      )}
      {page === "/admin" && isAdmin && (
        <>
          <h2 onClick={() => handleScrollToSection("products-section")}>
            Gestão de Produtos
          </h2>
          <ul>
            <h3>Categorias</h3>
            <li
              id="category"
              value="all"
              onClick={() => handleCategoryClick(null)}
            >
              Todos os produtos
            </li>
            <li
              id="category"
              value="all"
              onClick={() => handleCategoryClick(null, true)}
            >
              Editados
            </li>
            {categories.map((category, index) => (
              <li
                key={index}
                value={category.name}
                id={category.name}
                onClick={() => handleCategoryClick(category)}
              >
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </li>
            ))}
          </ul>
          <h2 onClick={() => handleScrollToSection("users-section")}>
            Gestão de Utilizadores
          </h2>
          <h2 onClick={() => handleScrollToSection("categories-section")}>
            Gestão de Categorias
          </h2>
        </>
      )}
    </aside>
  );
};
export default Aside;
