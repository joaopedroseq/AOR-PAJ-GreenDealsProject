import React, { useState, useEffect } from "react";
import placeholder from "../../assets/placeholder/item.png";
import "./admin.css";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../../Utils/ToastConfig/toastConfig";
import { useForm } from "react-hook-form";
import { getLoggedUserInformation } from "../../Handles/handleLogin";
import useUserStore from "../../stores/useUserStore";
import productCard from "../../components/ProductCard/productCard";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import useProductStore from "../../stores/useProductStore";
import useCategoriesStore from "../../stores/useCategoriesStore";
import errorMessages from "../../Utils/constants/errorMessages";
import { useNavigate } from "react-router-dom";
import handleGetAllUsers from "../../Handles/handleGetAllUsers";
import UserCard from "../../components/UserCard/UserCard";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import handleDeleteUserProducts from "../../Handles/handleDeleteUserProducts";
import handleExcludeUser from "../../Handles/handleExcludeUser";
import handleDeleteUser from "../../Handles/handleDeleteUser"

export const Admin = () => {
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();

  //Confirmation Modal - costumização e abertura/fecho
  const [modalConfig, setModalConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Users - obtenção de todos os utilizadores
  const [allUsers, setAllUsers] = useState([]);

  //Products - operações de obtenção de todos os produtos
  const { setFilters } = useProductStore();
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);

  //Categories
  //Get todas as categorias
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  //Adicionar nova categoria
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const handleAddCategory = useCategoriesStore(
    (state) => state.handleAddCategory
  );
  //Apagar categoria
  const handleDeleteCategory = useCategoriesStore(
    (state) => state.handleDeleteCategory
  );

  //Chamada à entrada da página para verificar se utilizador autenticado é admin
  //E filtra e fazer fetch de todos os produtos
  useEffect(() => {
    const getProducts = async () => {
      try {
        let userInformation = await getLoggedUserInformation(token);
        if (userInformation.admin === false) {
          showInfoToast("Não tem permissão para aceder a esta página");
          navigate("/");
        } else {
          let username = null;
          let excluded = null;
          let category = null;
          setFilters({ category, username, excluded });
          await fetchProducts(token);
          const users = await handleGetAllUsers(token);
          setAllUsers(users);
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

  //Handles
  //Categorias
  //Adicionar Nova Categoria
  const handleSubmittingNewCategory = (data) => {
    setModalConfig({
      title: "Adicionar Categoria?",
      message1: `Deseja adicionar nova categoria ${data.newCategoryName}?`,
      message2: null,
      onConfirm: async () => {
        const response = await handleAddCategory(token, data.newCategoryName);
        if (response) {
          showSuccessToast("Categoria adicionada com sucesso!");
          fetchCategories();
          setShowAddCategory(false);
          reset();
          setIsModalOpen(false);
        }
        else{
          setShowAddCategory(false);
          reset();
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  const onError = (errors) => {
    if (errors.newCategoryName) {
      showErrorToast(errors.newCategoryName.message);
    }
  };


  // Apagar Categoria
  const handleRemovingCategory = (category) => {
    setModalConfig({
      title: "Remover categoria?",
      message1: `Deseja remover categoria ${category.name}?`,
      message2: `Os ${category.products.length} produtos associados ficarão empty`,
      onConfirm: async () => {
        const response = await handleDeleteCategory(token, category);
        if (response) {
          showSuccessToast("Categoria removida com sucesso!");
          fetchCategories();
          fetchProducts(token);
          setIsModalOpen(false);
        }
        else{
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  //Users
  //Apagar produtos de utilizador
  const handleDeletingUserProducts = async(user) => {
    setModalConfig({
      title: "Remover produtos de utilizador",
      message1: `Deseja apagar todos os produtos de ${user.username}?`,
      message2: null,
      onConfirm: async () => {
        const response = await handleDeleteUserProducts(token, user.username);
        if (response) {
          showSuccessToast(`Apagados todos os produtos de ${user.username}`);
          fetchProducts(token);
          setIsModalOpen(false);
        }
        else{
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  }

  //Excluír utilizador
  const handleExcludingUser = async(user) => {
    setModalConfig({
      title: "Excluir utilizador",
      message1: `Deseja excluir o utilizador ${user.username}?`,
      message2: 'Irá também excluir todos os seus produtos',
      onConfirm: async () => {
        const response = await handleExcludeUser(token, user.username);
        if (response) {
          showSuccessToast(`Excluído o utilizador ${user.username}`);
          const users = await handleGetAllUsers(token);
          setAllUsers(users);
          fetchProducts(token);
          setIsModalOpen(false);
        }
        else{
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  }

  //Apagar utilizador
  const handleDeletingUser = async(user) => {
    setModalConfig({
      title: "Apagar utilizador",
      message1: `Deseja apagar o utilizador ${user.username}?`,
      message2: 'Os seus produtos serão excluídos',
      onConfirm: async () => {
        const response = await handleDeleteUser(token, user.username);
        if (response) {
          showSuccessToast(`Apagado o utilizador ${user.username}`);
          const users = await handleGetAllUsers(token);
          setAllUsers(users);
          fetchProducts(token);
          setIsModalOpen(false);
        }
        else{
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  }


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
              <productCard key={product.id} product={product} />
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
            allUsers.map((user) => <UserCard
            key={user.id}
            user={user}
            onDeleteProducts={() => handleDeletingUserProducts(user)}
            onExcludeUser={() => handleExcludingUser(user)}
            onDeleteUser={() => handleDeletingUser(user)}
            />)
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
              <CategoryCard
                key={category.id}
                category={category}
                onDelete={() => handleRemovingCategory(category)}
              />
            ))
          )}
          <div className="category-card" id="addCategory-card">
            {/* Adicionar Nova Categoria - Form */}
            <div className="category-info">
              <button
                className="showAddCategory"
                id="showAddCategory"
                onClick={() => {
                  setShowAddCategory(!showAddCategory);
                }}
              >
                Criar nova categoria
              </button>
              <form
                className={`newCategoryName ${
                  showAddCategory ? "slide-in" : "slide-out"
                }`}
                id="newCategoryName"
                onSubmit={handleSubmit(handleSubmittingNewCategory, onError)}
              >
                <label>nome da categoria</label>
                <input
                  type="text"
                  className="newCategoryNameBox"
                  id="newCategoryNameBox"
                  maxLength="20"
                  placeholder="nome da nova categoria"
                  {...register("newCategoryName", {
                    required: "Terá de preencher com o nome da nova categoria",
                  })}
                />
                <button type="submit" className="addCategory" id="addCategory">
                  Adicionar
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ConfirmationModal
        title={modalConfig.title}
        message1={modalConfig.message1}
        message2={modalConfig.message2}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
};

export default Admin;
