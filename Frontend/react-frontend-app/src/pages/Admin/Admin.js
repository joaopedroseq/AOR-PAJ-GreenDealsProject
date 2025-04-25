import React, { useState, useEffect } from "react";
import placeholder from "../../Assets/placeholder/item.png";
import "./admin.css";
import { useForm } from "react-hook-form";
import { getLoggedUserInformation } from "../../Handles/handleLogin";
import useUserStore from "../../Stores/useUserStore";
import CategoryCard from "../../Components/CategoryCard/CategoryCard";
import ProductCard from '../../Components/ProductCard/ProductCard';
import useProductStore from "../../Stores/useProductStore";
import useCategoriesStore from "../../Stores/useCategoriesStore";
import { useNavigate } from "react-router-dom";
import handleGetAllUsers from "../../Handles/handleGetAllUsers";
import UserCard from "../../Components/UserCard/UserCard";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";
import { useIntl } from "react-intl";
import useLocaleStore from "../../Stores/useLocaleStore";
import handleNotification from "./../../Handles/handleNotification";
import { handleExcludingUser, handleDeletingUserProducts, handleDeletingUser } from '../../Handles/handleUserOperations';


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
   //Internacionalização
    const intl = useIntl();
    const locale = useLocaleStore((state) => state.locale);



  //Chamada à entrada da página para verificar se utilizador autenticado é admin
  //E filtra e fazer fetch de todos os produtos
  useEffect(() => {
    const getProducts = async () => {
      try {
        let userInformation = await getLoggedUserInformation(token, intl);
        if (!userInformation.admin) {
          handleNotification(intl, "info", "adminNoPermission");
          navigate("/");
        } else {
          setFilters({ category: null, username: null, excluded: null, state: "DRAFT" }); //excluded null to get both excluded and not
          await fetchProducts(token);
          const users = await handleGetAllUsers(token, intl);
          setAllUsers(users);
        }
      } catch (error) {
        handleNotification(intl, "error", `error${error.message}`);
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
      message1: intl.formatMessage({ id: "adminNewCategoryConfirm" }, { newCategoryName: data.newCategoryName }),
      message2: null,
      onConfirm: async () => {
        try {
          const response = await handleAddCategory(token, data.newCategoryName);
          if (response) {
            handleNotification(intl, "success", "adminNewCategorySuccess");
            fetchCategories();
          }
        } catch (error) {
          handleNotification(intl, "error", `error${error.message}`);
        } finally {
          reset();
          setShowAddCategory(false);
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  const onError = (errors) => {
    Object.keys(errors).forEach((errorKey) => {
      handleNotification(intl, "error", `adminNewCategoryError${errorKey}`);
    });
  };


  // Apagar Categoria
  const handleRemovingCategory = (category) => {
    setModalConfig({
      title: intl.formatMessage({ id: "adminModalRemoveCategoryTitle" }),
      message1: intl.formatMessage({ id: "adminModalRemoveCategoryMessage1" }, { categoryName: category.name }),
      message2: intl.formatMessage({ id: "adminModalRemoveCategoryMessage2" }, { numberOfProducts: category.products.length }),
      onConfirm: async () => {
        try {
          const response = await handleDeleteCategory(token, category);
          if (response) {
            handleNotification(intl, "success", "adminRemoveCategorySuccess");
            fetchCategories();
            fetchProducts(token);
          }
        } catch (error) {
          handleNotification(intl, "error", `error${error.message}`);
        } finally {
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  //Users
  //Apagar produtos de utilizador
  const handleDeleteUserProducts = (user) => {
    setModalConfig({
      title: intl.formatMessage({ id: "adminRemoveUserProductsTitle"}, { user: user.username }),
      message1: intl.formatMessage({ id: "adminRemoveUserProductsMessage1" }, { username: user.username }),
      message2: null,
      onConfirm: async () => {
        await handleDeletingUserProducts(token, user, setIsModalOpen, fetchProducts, intl);
      },
    });
  
    setIsModalOpen(true);
  };


  //Excluír utilizador
  const handleExcludeUser = async(user) => {
    setModalConfig({
      title: intl.formatMessage({ id: "adminExcludeUserTitle"}),
      message1: intl.formatMessage({ id: "adminExcludeUserMessage1"}, { username: user.username}),
      message2: intl.formatMessage({ id: "adminExcludeUserMessage2"}),
      onConfirm: async () => {
        await handleExcludingUser(token, user, setAllUsers, setIsModalOpen, fetchProducts, intl);
      },
    });
  
    setIsModalOpen(true);
  };

  //Apagar utilizador
  const handleDeleteUser = async(user) => {
    setModalConfig({
      title: intl.formatMessage({ id: "adminDeleteUserTitle"}),
      message1: intl.formatMessage({ id: "adminDeleteUserMessage1"}, { username: user.username}),
      message2: intl.formatMessage({ id: "adminDeleteUserMessage2"}),
      onConfirm: async () => {
        await handleDeletingUser(token, user, setAllUsers, setIsModalOpen, null, fetchProducts, intl);
      },
    });
    setIsModalOpen(true);
  };


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
            products.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)
          )}
        </div>
      </section>
      <section className="users-section" id="users-section">
        <h3>{intl.formatMessage({ id: "UserManagementTitle"})}</h3>
        <div id="user-info-container" className="user-info-container">
          {allUsers.length === 0 ? (
            <p>{intl.formatMessage({ id: "noUsersToShow"})}</p>
          ) : (
            allUsers.map((user, index) => (
              <UserCard
                key={user.id || index}
                user={user}
                onDeleteProducts={() => handleDeleteUserProducts(user)}
                onExcludeUser={() => handleExcludeUser(user)}
                onDeleteUser={() => handleDeleteUser(user)}
              />
            ))
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
            categories.map((category, index) => (
              <CategoryCard
                key={category.nome || category.nameEng || index}
                category={category}
                onDelete={() => handleRemovingCategory(category)}
                locale={locale}
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
