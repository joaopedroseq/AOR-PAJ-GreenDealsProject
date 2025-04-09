import React, { useState, useEffect } from "react";
import placeholder from "../../Assets/placeholder/item.png";
import exclude from "../../Assets/icons/exclude.png";
import deleteProducts from "../../Assets/icons/deleteProducts.png";
import deleteUser from '../../Assets/icons/deleteUser.png';
import "./profile.css";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../../Utils/ToastConfig/toastConfig";
import { useForm } from "react-hook-form";
import handleGetUserInformation from "../../Handles/handleGetUserInformation";
import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../../Stores/useUserStore";
import productCard from "../../Components/ProductCard/productCard.js";
import useProductStore from "../../Stores/useProductStore";
import useCategoriesStore from "../../Stores/useCategoriesStore";
import errorMessages from "../../Utils/constants/errorMessages";
import { getLoggedUserInformation } from "../../Handles/handleLogin";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";
import handleDeleteUserProducts from "../../Handles/handleDeleteUserProducts";
import handleExcludeUser from "../../Handles/handleExcludeUser";
import handleDeleteUser from "../../Handles/handleDeleteUser";
import { checkIfValidName } from "../../Utils/utilityFunctions.js";
import handleChangeUserInformation from "../../Handles/handleChangeUserInformation";

export const Profile = () => {
  const token = useUserStore((state) => state.token);
  const username = new URLSearchParams(useLocation().search).get("username");
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({});

  //Confirmation Modal
  const [modalConfig, setModalConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Products
  const { setFilters } = useProductStore();
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);

  //Operações de form para edição de informações do utilizador
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //Get das informações do utilizador
  const getProfileInformation = async () => {
    let userInformation = await handleGetUserInformation(username, token);
    setUserProfile(userInformation);
  };

  //Get dos produtos do utilizador (requer token para aceder aos produtos excluídos (apenas para admins))
  const getUserProducts = async () => {
    try {
      if (userProfile?.username) {
        let username = userProfile.username;
        let excluded = false;
        setFilters({ username, excluded });
        await fetchProducts(token);
      }
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
    }
  };

  //Obter informação do utilizador autenticado e redirecionar caso não seja admin
  useEffect(() => {
    const checkIfAdmin = async () => {
      try {
        let userInformation = await getLoggedUserInformation(token);
        if (userInformation.admin === false) {
          showInfoToast("Não tem permissão para aceder a esta página");
          navigate("/");
        }
      } catch (error) {
        const toastMessage =
          errorMessages[error.message] || errorMessages.unexpected_error;
        showErrorToast(toastMessage);
        navigate("/");
      }
    };
    checkIfAdmin();
    getProfileInformation();
    getUserProducts();
  }, []);

  //useEffect de refresh de todos os dados do utilizador (informações e produtos) caso este não seja admin
  useEffect(() => {
    const getUserProducts = async () => {
      try {
        if (userProfile?.username) {
          let username = userProfile.username;
          setFilters({ username });
          await fetchProducts(token);
        }
      } catch (error) {
        const toastMessage =
          errorMessages[error.message] || errorMessages.unexpected_error;
        showErrorToast(toastMessage);
      }
    };
    getUserProducts();
  }, [userProfile]);

  //Submissão de form para alteração de informações do utilizador
  const onSubmit = async (newUserInformation) => {
    setModalConfig({
      title: "Alterar informações de utilizador",
      message1: `Pretende alterar informações do utilizador ${userProfile.username}?`,
      message2: null,
      onConfirm: async () => {
        let password = null; //não necessário já que o utilizador é admin
        let isAdmin = true;

        const isUserUpdated = await handleChangeUserInformation(
          userProfile,
          newUserInformation,
          password,
          token,
          isAdmin
        );
        if (isUserUpdated) {
          getProfileInformation();
          reset();
          setIsModalOpen(false);
        } else {
          reset();
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  // Apresentação de erros ao utilizador
  const onError = (errors) => {
    if (errors.firstName) {
      showErrorToast(errors.firstName.message);
    }
    if (errors.lastName) {
      showErrorToast(errors.lastName.message);
    }
    if (errors.username) {
      showErrorToast(errors.username.message);
    }
    if (errors.password) {
      showErrorToast(errors.password.message);
    }
    if (errors.passwordConfirm) {
      showErrorToast(errors.passwordConfirm.message);
    }
    if (errors.email) {
      showErrorToast(errors.email.message);
    }
    if (errors.phoneNumber) {
      showErrorToast(errors.phoneNumber.message);
    }
    if (errors.urlPhoto) {
      showErrorToast(errors.urlPhoto.message);
    }
  };

  //Users
  //Apagar produtos de utilizador
  const handleDeletingUserProducts = async () => {
    setModalConfig({
      title: "Remover produtos de utilizador",
      message1: `Deseja apagar todos os produtos de ${userProfile.username}?`,
      message2: null,
      onConfirm: async () => {
        const response = await handleDeleteUserProducts(token, userProfile.username);
        if (response) {
          showSuccessToast(`Apagados todos os produtos de ${userProfile.username}`);
          fetchProducts(token);
          setIsModalOpen(false);
        } else {
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  //Excluír utilizador
  const handleExcludingUser = async () => {
    setModalConfig({
      title: "Excluir utilizador",
      message1: `Deseja excluir o utilizador ${userProfile.username}?`,
      message2: 'Irá também excluir todos os seus produtos',
      onConfirm: async () => {
        const response = await handleExcludeUser(token, userProfile.username);
        if (response) {
          showSuccessToast(`Excluído o utilizador ${userProfile.username}`);
          //
          fetchProducts(token);
          setIsModalOpen(false);
        } else {
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  //Apagar utilizador
  const handleDeletingUser = async () => {
    setModalConfig({
      title: "Apagar utilizador",
      message1: `Deseja apagar o utilizador ${userProfile.username}?`,
      message2: 'Todos os seus produtos serão excluídos',
      onConfirm: async () => {
        const response = await handleDeleteUser(token, userProfile.username);
        if (response) {
          showSuccessToast(`Apagado o utilizador ${userProfile.username}`);
          setIsModalOpen(false);
          navigate('/admin');
        } else {
          setIsModalOpen(false);
        }
      },
    });
    setIsModalOpen(true);
  };

  return (
    <div className="user-main-content">
      {userProfile?.username && (
      <>
      <section className="products-section" id="products-section">
        <h3>Produtos de {userProfile.username}</h3>
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
      <section className="profile-section" id="profile-section">
        <h3>Informações de {userProfile.username}</h3>
        {userProfile?.username && (
          <div id="user-info-container">
            <form
              className="edit-form"
              id="edit-form"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <div className="edit-userinfo-form-field">
                <img
                className="user-profile-photo"
                src={userProfile.url}
                alt="user icon"
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>Primeiro Nome</label>
                <input
                  type="text"
                  id="edit-firstname"
                  maxLength="20"
                  defaultValue={userProfile.firstName}
                  {...register("firstName", {
                    required: "Terá de preencher o primeiro nome",
                    validate: (value) =>
                      checkIfValidName(value) ||
                      "O primeiro nome não deverá conter caracteres especiais",
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>Último Nome</label>
                <input
                  type="text"
                  id="edit-lastname"
                  maxLength="20"
                  defaultValue={userProfile.lastName}
                  {...register("lastName", {
                    required: "Terá de preencher o apelido",
                    validate: (value) =>
                      checkIfValidName(value) ||
                      "O apelido não deverá conter caracteres especiais",
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>Email</label>
                <input
                  type="text"
                  id="edit-email"
                  maxLength="40"
                  defaultValue={userProfile.email}
                  {...register("email", {
                    required: "Terá de preencher o seu email",
                    validate: (value) =>
                      value.includes("@") || "O seu email tem de conter um @",
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>Telefone</label>
                <input
                  type="text"
                  id="edit-phone"
                  maxLength="20"
                  defaultValue={userProfile.phoneNumber}
                  {...register("phoneNumber", {
                    required: "Terá de preencher o seu contacto telefónico",
                    validate: (value) =>
                      /^\d{9}$/.test(value) ||
                      "O seu número de telefone tem de conter pelo menos 9 digitos",
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>Foto url</label>
                <input
                  type="text"
                  id="edit-photoUrl"
                  defaultValue={userProfile.url}
                  {...register("url", {
                    required:
                      "Terá de preencher com o url da sua fotografia de perfil",
                  })}
                />
              </div>
              <input
                type="submit"
                id="guardarAlteracoesUser-btn"
                className="guardarAlteracoesUser-btn"
                value="Guardar Alterações"
              />
              <div>
              <img
                src={deleteProducts}
                alt="exclude user"
                className="deleteProductsUserBtn"
                onClick={handleDeletingUserProducts}
              />
              <img
                src={exclude}
                alt="exclude user"
                className="excludeUserBtn"
                onClick={handleExcludingUser}
              />
              <img
                src={deleteUser}
                alt="delete user"
                className="deleteUserBtn"
                onClick={handleDeletingUser}
              />
              </div>
            </form>
          </div>
        )}
      </section>
      </>)}
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

export default Profile;
