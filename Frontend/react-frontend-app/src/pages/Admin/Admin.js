import React, { useState, useEffect } from "react";
import placeholder from "../../assets/placeholder/item.png";
import "./admin.css";
import {
  showErrorToast,
  showInfoToast,
} from "../../Utils/ToastConfig/toastConfig";
import { getUserInformation } from "../../hooks/handleLogin";
import useUserStore from "../../stores/useUserStore";
import ProductCard from "../../components/ProductCard/ProductCard";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import useProductStore from "../../stores/useProductStore";
import useCategoriesStore from "../../stores/useCategoriesStore";
import errorMessages from "../../Utils/constants/errorMessages";
import { useNavigate } from "react-router-dom";
import handleGetAllUsers from "../../hooks/handleGetAllUsers";
import UserCard from "../../components/UserCard/UserCard";

export const Admin = () => {
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();
  const { setFilters } = useProductStore();
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const [allUsers, setAllUsers] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      try {
        let userInformation = await getUserInformation(token);
        if (userInformation.admin === false) {
          showInfoToast("Não tem permissão para aceder a esta página");
          navigate("/");
        } else {
          let username = null;
          let excluded = null;
          setFilters({ username, excluded });
          await fetchProducts(token);
          const users = await handleGetAllUsers(token);
          console.log(users);
          setAllUsers(users);
        }
      } catch (error) {
        const toastMessage =
          errorMessages[error.message] || errorMessages.unexpected_error;
        showErrorToast(toastMessage);
        navigate("/");
      }
      console.log(allUsers);
    };

    getProducts();
  }, []);

  return (
    <div className="admin-main-content">
      <section className="products-section" id="products-section">
        <h3>Gestão de Produtos</h3>
        <div className="grid-container">
          {products.length === 0 ? (
            <div className="grid-item no-products">
              <img src={placeholder} alt="No products available" />
              <div className="text-overlay">
                <h2>No Products Available</h2>
                <p>Please check back later.</p>
              </div>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>
      <section className="users-section" id="users-section">
        <h3>Gestão de utilizadores</h3>
        <div id="user-info-container" className="user-info-container">
          {allUsers.length === 0 ? (
            <p>Sem utilizadores</p>
          ) : (
            allUsers.map((user) => <UserCard key={user.id} user={user} />)
          )}
        </div>
      </section>
      <section className="categories-section" id="categories-section">
        <h3>Gestão de categorias</h3>
        <div className="category-container" id="category-container">
          {categories.length === 0 ? (
            <div className="category-card">
              <div className="category-info">
                <p className="category-name">Não existem categorias criadas</p>
              </div>
            </div>
          ) : (
            categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
          <div className="category-card" id="addCategory-card">
            <div className="category-info">
              <button
                className="showAddCategory"
                id="showAddCategory"
                onClick={() => {
                  console.log("Button clicked!");
                  setShowAddCategory(!showAddCategory);
                }}
              >
                Criar nova categoria
              </button>
                <div
                className={`newCategoryName ${showAddCategory ? "slide-in" : "slide-out"}`}
                id="newCategoryName"
              >
                  <label>nome da categoria:</label>
                  <input
                    type="text"
                    className="newCategoryNameBox"
                    id="newCategoryNameBox"
                    maxLength="20"
                  />
                  <button className="addCategory" id="addCategory">
                    Adicionar
                  </button>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;
