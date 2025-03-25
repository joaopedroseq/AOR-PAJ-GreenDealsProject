import React, { useState, useEffect } from "react";
import placeholder from "../../assets/placeholder/item.png";
import "./admin.css";
import { useForm } from "react-hook-form";
import {
  showErrorToast,
  showInfoToast,
} from "../../Utils/ToastConfig/toastConfig";
import { getUserInformation } from "../../hooks/handleLogin";
import userStore from "../../stores/UserStore";
import ProductCard from "../../components/ProductCard/productCard";
import useProductStore from "../../stores/useProductStore";
import errorMessages from "../../Utils/constants/errorMessages";
import { checkIfValidName } from "../../Utils/UtilityFunctions";
import ConfirmPasswordModal from "../../components/ConfirmPasswordModal/ConfirmPasswordModal";
import ChangePasswordModal from "../../components/ChangePasswordModal/ChangePasswordModal";
import { useNavigate } from "react-router-dom";

export const Admin = () => {
  const token = userStore((state) => state.token);
  const navigate = useNavigate();
  const { setFilters } = useProductStore();
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);

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
          setFilters({username, excluded});
          const filters = useProductStore.getState().filters;
          console.log(filters)
          await fetchProducts(token);
          const updatedProducts = useProductStore.getState().products;
          console.log("Fetched Products:", updatedProducts);
        }
      } catch (error) {
        const toastMessage =
          errorMessages[error.message] || errorMessages.unexpected_error;
        showErrorToast(toastMessage);
        navigate("/");
      }
    };
    getProducts();
  }, []);

  return (
    <div className="admin-main-content">
      <div className="product-section" id="produtos">
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
      </div>
      <div className="profile-section" id="utilizadores">
        <h3>Gestão de utilizadores</h3>
        <div id="user-info-container" className="user-info-container"></div>
      </div>
      <div className="profile-section" id="categorias">
        <h3>Gestão de categorias</h3>
        <div className="category-container" id="category-container">
          <div className="category-card" id="addCategory-card">
            <div className="category-info">
              <button className="showAddCategory" id="showAddCategory">
                Criar nova categoria
              </button>
              <div
                className="newCategoryName"
                id="newCategoryName"
                style={{ display: "none" }}
              >
                <label>nome da categoria:</label>
                <input
                  type="text"
                  className="newCategoryNameBox"
                  id="newCategoryNameBox"
                  maxlength="20"
                />
                <button className="addCategory" id="addCategory">
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
