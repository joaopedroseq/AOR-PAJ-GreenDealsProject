import React, { useState, useEffect } from "react";
import placeholder from "../../Assets/placeholder/item.png";
import "./admin.css";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../../Utils/ToastConfig/toastConfig";
import { useForm } from "react-hook-form";
import { getLoggedUserInformation } from "../../Handles/handleLogin";
import useUserStore from "../../Stores/useUserStore";
import CategoryCard from "../../Components/CategoryCard/CategoryCard";
import ProductCard from '../../Components/ProductCard/productCard';
import useProductStore from "../../Stores/useProductStore";
import useCategoriesStore from "../../Stores/useCategoriesStore";
import errorMessages from "../../Utils/constants/errorMessages";
import { useNavigate } from "react-router-dom";
import handleGetAllUsers from "../../Handles/handleGetAllUsers";
import UserCard from "../../Components/UserCard/UserCard";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";
import handleDeleteUserProducts from "../../Handles/handleDeleteUserProducts";
import handleExcludeUser from "../../Handles/handleExcludeUser";
import handleDeleteUser from "../../Handles/handleDeleteUser";
import useLocaleStore from "../../Stores/useLocaleStore";
import { useIntl } from "react-intl";

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
  } = useForm();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const handleAddCategory = useCategoriesStore(
    (state) => state.handleAddCategory
  );
  //Apagar categoria
  const handleDeleteCategory = useCategoriesStore(
    (state) => state.handleDeleteCategory
  );
   //Opções de língua
    const locale = useLocaleStore((state) => state.locale);
    const updateLocale = useLocaleStore((state) => state.updateLocale);
    const intl = useIntl();

  //Chamada à entrada da página para verificar se utilizador autenticado é admin
  //E filtra e fazer fetch de todos os produtos
  useEffect(() => {
    const getProducts = async () => {
      try {
        let userInformation = await getLoggedUserInformation(token);
        if (userInformation.admin === false) {
          showInfoToast(intl.formatMessage({ id: "adminNoPermission" }));
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
      title: intl.formatMessage({ id: "adminModalAddCategoryTitle" }),
      message1: intl.formatMessage({ id: 'goodbye' }, { newCategoryName: data.newCategoryName }),
      message2: null,
      onConfirm: async () => {
        const response = await handleAddCategory(token, data.newCategoryName);
        if (response) {
          showSuccessToast(intl.formatMessage({ id: "adminNewCategorySuccess" }));
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
      title: intl.formatMessage({ id: "adminModalRemoveCategoryTitle" }),
      message1: intl.formatMessage({ id: "adminModalRemoveCategoryMessage1"}, { categoryName: category.name}),
      message2: intl.formatMessage({ id: "adminModalRemoveCategoryMessage1"}, { numberOfProducts: category.products.length}),
      onConfirm: async () => {
        const response = await handleDeleteCategory(token, category);
        if (response) {
          showSuccessToast(intl.formatMessage({ id: "adminRemoveCategorySucess" }));
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
      title: intl.formatMessage({ id: "adminRemoveUserProductsTitle"}),
      message1: intl.formatMessage({ id: "adminModalRemoveCategoryMessage1"}, { username: user.username}),
      message2: null,
      onConfirm: async () => {
        const response = await handleDeleteUserProducts(token, user.username);
        if (response) {
          showSuccessToast(intl.formatMessage({ id: "adminModalRemoveCategoryMessage1"}, { username: user.username}))
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
      title: intl.formatMessage({ id: "adminExcludeUserTitle"}),
      message1: intl.formatMessage({ id: "adminExcludeUserMessage1"}, { username: user.username}),
      message2: intl.formatMessage({ id: "adminExcludeUserMessage2"}),
      onConfirm: async () => {
        const response = await handleExcludeUser(token, user.username);
        if (response) {
          showSuccessToast(intl.formatMessage({ id: "adminExcludeUserSuccess"}, { username: user.username}));
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
      title: intl.formatMessage({ id: "adminDeleteUserTitle"}),
      message1: intl.formatMessage({ id: "adminDeleteUserMessage1"}, { username: user.username}),
      message2: intl.formatMessage({ id: "adminDeleteUserMessage2"}),
      onConfirm: async () => {
        const response = await handleDeleteUser(token, user.username);
        if (response) {
          showSuccessToast(intl.formatMessage({ id: "adminDeleteUserSuccess"}, { username: user.username}));
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
        <h3>{intl.formatMessage({ id: "ProductsManagementTitle"})}</h3>
        <div className="grid-container">
          {products.length === 0 ? (
            <div className="grid-item no-products">
              <img src={placeholder} alt="No products available" />
              <div className="text-overlay">
                <h2>{intl.formatMessage({ id: "noProductsToShow"})}</h2>
                <p>{intl.formatMessage({ id: "checkBackLater"})}</p>
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
        <h3>{intl.formatMessage({ id: "categoryManagementTitle"})}</h3>
        <div id="user-info-container" className="user-info-container">
          {allUsers.length === 0 ? (
            <p>{intl.formatMessage({ id: "noUsersToShow"})}</p>
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
        <h3>{intl.formatMessage({ id: "categoryManagementTitle"})}</h3>
        <div className="category-container" id="category-container">
          {categories.length === 0 ? (
            <div className="category-card">
              <div className="category-info">
                <p className="category-name">{intl.formatMessage({ id: "noCategoriesToShow"})}</p>
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
                {intl.formatMessage({ id: "createNewCategory"})}
              </button>
              <form
                className={`newCategoryName ${
                  showAddCategory ? "slide-in" : "slide-out"
                }`}
                id="newCategoryName"
                onSubmit={handleSubmit(handleSubmittingNewCategory, onError)}
              >
                <label>{intl.formatMessage({ id: "categoryNameLabel"})}</label>
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
                {intl.formatMessage({ id: "addCategoryButtonLabel"})}
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
