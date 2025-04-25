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
import { useIntl } from "react-intl";
import handleNotification from "../../Handles/handleNotification";

const Aside = ({ isAsideVisible }) => {
  //User state
  const token = useUserStore((state) => state.token);
  const [isAdmin, setIsAdmin] = useState(false);
  const page = useLocation().pathname;
  //Categories load
  const displayedCategories = useCategoriesStore(
    (state) => state.displayedCategories
  );
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const { setFilters, fetchProducts } = useProductStore();
  //Locale
  const locale = useLocaleStore((state) => state.locale);
  const intl = useIntl();

  //Para apresentação na página de profile
  const username = new URLSearchParams(useLocation().search).get("username");

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        let userInfo = await getLoggedUserInformation(token, intl);
        setIsAdmin(userInfo.admin);
      } catch (error) {
        handleNotification(intl, "error", `error${error.message}`);
      }
    };
  
    if (["/user", "/admin", "/profile"].includes(page)) {
      getUserInfo();
    }
    fetchCategories();
  }, [token, page, fetchCategories]);

  const handleCategoryClick = (category, edited, user = null, ) => {
    setFilters({ category: category || null, edited: edited || null});
    if (["/user", "/admin", "/profile"].includes(page)) {
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
          {intl.formatMessage({ id: "asideUserInfo" })}
        </h3>
      )}
      {page === "/user" && isAdmin && (
        <Link to="/admin" className="link">
          <h3 className="asideTitle">
            {intl.formatMessage({ id: "asideAdminPage" })}
          </h3>
        </Link>
      )}
      {page === "/admin" && isAdmin && (
        <ul>
          <h3 onClick={() => handleScrollToSection("products-section")}>
            {intl.formatMessage({ id: "asideAdminProductManagement" })}
          </h3>
          <ul>
            {renderCategoryList(
              displayedCategories,
              locale,
              handleCategoryClick
            )}
          </ul>
          <h3
            className="asideTitle"
            onClick={() => handleScrollToSection("users-section")}
          >
            {intl.formatMessage({ id: "asideAdminUserManagement" })}
          </h3>
          <h3
            className="asideTitle"
            onClick={() => handleScrollToSection("categories-section")}
          >
            {intl.formatMessage({ id: "asideAdminCategoryManagement" })}
          </h3>
        </ul>
      )}
      {page === "/profile" && isAdmin && (
        <>
          <h2 onClick={() => handleScrollToSection("products-section")}>
            {intl.formatMessage({ id: "asideUserProducts" }, { username })}
          </h2>
          <ul>
            {renderCategoryList(
              displayedCategories,
              locale,
              handleCategoryClick
            )}
          </ul>
          <h2 onClick={() => handleScrollToSection("profile-section")}>
            {intl.formatMessage({ id: "asideUserInfoDetailed" }, { username })}
          </h2>
        </>
      )}
    </aside>
  );
};

export default Aside;
