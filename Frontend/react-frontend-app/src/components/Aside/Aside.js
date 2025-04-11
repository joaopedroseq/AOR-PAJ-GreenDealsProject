import React, { useEffect, useState } from "react";
import "./aside.css";
import { useLocation } from "react-router-dom";
import useProductStore from "../../Stores/useProductStore";
import { useCategoriesStore } from "../../Stores/useCategoriesStore";
import useUserStore from "../../Stores/useUserStore";
import useLocaleStore from "../../Stores/useLocaleStore";
import { getLoggedUserInformation } from "../../Handles/handleLogin";
import { Link } from "react-router-dom";
import { renderCategoryList } from "../../Handles/renderCategoryList";

const Aside = ({ isAsideVisible }) => {
  //User state
  const token = useUserStore((state) => state.token);
  const [isAdmin, setIsAdmin] = useState(false);
  const page = useLocation().pathname;
  //Categories load
  const displayedCategories = useCategoriesStore((state) => state.displayedCategories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const { setFilters, fetchProducts } = useProductStore();
  //Locale
  const locale = useLocaleStore((state) => state.locale);

  //Para apresentação na página de profile
  const username = new URLSearchParams(useLocation().search).get("username");

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
    if (page === "/profile") {
      getUserInfo();
    }
    fetchCategories();
  }, [token, page]);
  
  useEffect(() => {
    useLocaleStore.getState().setLocale("en"); // Change the locale manually
  }, []);

  const categories = useCategoriesStore((state) => state.displayedCategories);

  const handleCategoryClick = (category, edited, user = null) => {
    if (category) {
      setFilters({ category: category });
    } else {
      setFilters({ category: null });
    }
    if (edited) {
      setFilters({ edited: true });
    }
    if (page === "/admin" || page === "/user" || page === "/profile") {
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
          {renderCategoryList(displayedCategories, locale, handleCategoryClick)}
        </ul>
      )}
      {page === "/user" && (
         <ul>
         {renderCategoryList(displayedCategories, locale, handleCategoryClick)}

       </ul>
      )}
      {page === "/user" && (
        <h3
          className="asideTitle"
          onClick={() => handleScrollToSection("profile-section")}
        >
          Informações
        </h3>
      )}
      {page === "/user" && isAdmin && (
        <Link to="/admin" className="link">
          <h3 className="asideTitle">Página de Administrador</h3>
        </Link>
      )}
      {page === "/admin" && isAdmin && (
        <ul>
          <h3 onClick={() => handleScrollToSection("products-section")}>
            Gestão de Produtos
          </h3>
          <ul>
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
            {displayedCategories.map((category, index) => (
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
          <h3
            className="asideTitle"
            onClick={() => handleScrollToSection("users-section")}
          >
            Gestão de Utilizadores
          </h3>
          <h3
            className="asideTitle"
            onClick={() => handleScrollToSection("categories-section")}
          >
            Gestão de Categorias
          </h3>
        </ul>
      )}
      {page === "/profile" && isAdmin && (
        <>
          <h2 onClick={() => handleScrollToSection("products-section")}>
            Produtos de {username}
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
            {displayedCategories.map((category, index) => (
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
          <h2 onClick={() => handleScrollToSection("profile-section")}>
            Informações de {username}
          </h2>
        </>
      )}
    </aside>
  );
};

useLocaleStore.subscribe(
  (state) => state.locale,
  (locale) => {
    console.log("🔥 Locale changed to:", locale);
    useCategoriesStore.getState().sortByLocale(locale); // ✅ Ensuring sorting updates store
  }
);
export default Aside;