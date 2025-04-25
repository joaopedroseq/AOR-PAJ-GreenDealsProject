import React, { useState, useEffect } from "react";
import placeholder from "../../Assets/placeholder/item.png";
import exclude from "../../Assets/icons/exclude.png";
import deleteProducts from "../../Assets/icons/deleteProducts.png";
import deleteUser from "../../Assets/icons/deleteUser.png";
import chatButton from "../../Assets/icons/chat.png";
import "./profile.css";
import { useForm } from "react-hook-form";
import handleGetUserInformation from "../../Handles/handleGetUserInformation";
import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../../Stores/useUserStore";
import useLocaleStore from "../../Stores/useLocaleStore.js";
import useProductStore from "../../Stores/useProductStore";
import { getLoggedUserInformation } from "../../Handles/handleLogin";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";
import { checkIfValidName } from "../../Utils/utilityFunctions";
import handleChangeUserInformation from "../../Handles/handleChangeUserInformation";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { useIntl } from "react-intl";
import handleNotification from "../../Handles/handleNotification.js";
import { handleExcludingUser, handleDeletingUserProducts, handleDeletingUser } from '../../Handles/handleUserOperations';

export const Profile = () => {
  const token = useUserStore((state) => state.token);
  const username = new URLSearchParams(useLocation().search).get("username");
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({});
  const [isOwner, setOwner] = useState(false);
  const [isAdmin, setAdmin] = useState(false);


 //Opções de língua
  const intl = useIntl();
  const locale = useLocaleStore((state) => state.locale);

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
    let userInformation = await handleGetUserInformation(username, token, intl);
    setUserProfile(userInformation);
  };

  useEffect(() => {
    const checkIfAdminAndOwner = async () => {
      try {
        let userInformation = await getLoggedUserInformation(token, intl);
        if (userInformation.admin === true) {
          console.log("isAdmin")
          setAdmin(true);
        }
        if(userInformation.username === username){
          console.log("isOwner")
          setOwner(true);
        }
      } catch (error) {
        handleNotification(intl, "error", `error${error.message}`);  
        navigate("/");
      }
    };
    checkIfAdminAndOwner();
    getProfileInformation();
  }, []);

  //useEffect de refresh de todos os dados do utilizador (informações e produtos) caso este não seja admin
  useEffect(() => {
    try {
    if (userProfile?.username) {
      let username = userProfile.username;
      let excluded = isAdmin ? true : false;
      let state = isAdmin || isOwner ? "DRAFT" : undefined;
      setFilters({ username, excluded, state });
      fetchProducts(token);
    }
   } catch (error) {
      handleNotification(intl, "error", `error${error.message}`);
    }
  }, [isAdmin, isOwner, userProfile]);
  

  const onSubmit = async (newUserInformation) => {
    setModalConfig({
      title: intl.formatMessage({ id: "profileUpdateTitle" }),
      message1: intl.formatMessage(
        { id: "profileUpdateMessage1" },
        { username: userProfile.username }
      ),
      message2: null,
      onConfirm: async () => {
        let password = null; // Not necessary since the user is an admin
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
    Object.keys(errors).forEach((errorKey) => {
      handleNotification(intl, "error", `profile${errorKey}Required`);
    });
  };

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
          await handleExcludingUser(token, user, null, setIsModalOpen, fetchProducts, intl);
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
          await handleDeletingUser(token, user, null, setIsModalOpen, navigate, fetchProducts, intl);
        },
      });
      setIsModalOpen(true);
    };


  return (
    <div className="user-main-content">
      {userProfile?.username && (
        <>
          <section className="products-section" id="products-section">
            <h3>
              {intl.formatMessage(
                { id: "profileUserProductsTitle" },
                { username: userProfile.username }
              )}
            </h3>
            <div className="grid-container">
              {products.length === 0 ? (
                <div className="grid-item no-products">
                  <img
                    src={placeholder}
                    alt={intl.formatMessage({ id: "profileNoProductsAlt" })}
                  />
                  <div className="text-overlay">
                    <h2>
                      {intl.formatMessage({ id: "profileNoProductsHeading" })}
                    </h2>
                    <p>
                      {intl.formatMessage({ id: "profileNoProductsMessage" })}
                    </p>
                  </div>
                </div>
              ) : (
                products.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)
              )}
            </div>
          </section>

          <section className="profile-section" id="profile-section">
            <h3>
              {intl.formatMessage(
                { id: "profileUserInfoTitle" },
                { username: userProfile.username }
              )}
            </h3>
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
                      alt={intl.formatMessage({ id: "profileUserIconAlt" })}
                    />
                  </div>
                  <div className="edit-userinfo-form-field">
                    <label>
                      {intl.formatMessage({ id: "profileFirstNameLabel" })}
                    </label>
                    <input
                      type="text"
                      id="edit-firstname"
                      maxLength="20"
                      defaultValue={userProfile.firstName}
                      {...register("firstName", {
                        required: intl.formatMessage({
                          id: "profileFirstNameRequired",
                        }),
                        validate: (value) =>
                          checkIfValidName(value) ||
                          intl.formatMessage({ id: "profileFirstNameInvalid" }),
                      })}
                    />
                  </div>
                  <div className="edit-userinfo-form-field">
                    <label>
                      {intl.formatMessage({ id: "profileLastNameLabel" })}
                    </label>
                    <input
                      type="text"
                      id="edit-lastname"
                      maxLength="20"
                      defaultValue={userProfile.lastName}
                      {...register("lastName", {
                        required: intl.formatMessage({
                          id: "profileLastNameRequired",
                        }),
                        validate: (value) =>
                          checkIfValidName(value) ||
                          intl.formatMessage({ id: "profileLastNameInvalid" }),
                      })}
                    />
                  </div>
                  <div className="edit-userinfo-form-field">
                    <label>
                      {intl.formatMessage({ id: "profileEmailLabel" })}
                    </label>
                    <input
                      type="text"
                      id="edit-email"
                      maxLength="40"
                      defaultValue={userProfile.email}
                      {...register("email", {
                        required: intl.formatMessage({
                          id: "profileEmailRequired",
                        }),
                        validate: (value) =>
                          value.includes("@") ||
                          intl.formatMessage({ id: "profileEmailInvalid" }),
                      })}
                    />
                  </div>
                  <div className="edit-userinfo-form-field">
                    <label>
                      {intl.formatMessage({ id: "profilePhoneLabel" })}
                    </label>
                    <input
                      type="text"
                      id="edit-phone"
                      maxLength="20"
                      defaultValue={userProfile.phoneNumber}
                      {...register("phoneNumber", {
                        required: intl.formatMessage({
                          id: "profilePhoneRequired",
                        }),
                        validate: (value) =>
                          /^\d{9}$/.test(value) ||
                          intl.formatMessage({ id: "profilePhoneInvalid" }),
                      })}
                    />
                  </div>
                  <div className="edit-userinfo-form-field">
                    <label>
                      {intl.formatMessage({ id: "profilePhotoUrlLabel" })}
                    </label>
                    <input
                      type="text"
                      id="edit-photoUrl"
                      defaultValue={userProfile.url}
                      {...register("url", {
                        required: intl.formatMessage({
                          id: "profilePhotoUrlRequired",
                        }),
                      })}
                    />
                  </div>
                  {(isOwner || isAdmin) && 
                  <input
                    type="submit"
                    id="guardarAlteracoesUser-btn"
                    className="guardarAlteracoesUser-btn"
                    value="Guardar Alterações"
                  />
                  }
                  {isAdmin && (
                  <div>
                    <img
                      src={deleteProducts}
                      alt="exclude user"
                      className="deleteProductsUserBtn"
                      onClick={handleDeleteUserProducts}
                    />
                    <img
                      src={exclude}
                      alt="exclude user"
                      className="excludeUserBtn"
                      onClick={handleExcludeUser}
                    />
                    <img
                      src={deleteUser}
                      alt="delete user"
                      className="deleteUserBtn"
                      onClick={handleDeleteUser}
                    />
                  </div>
                  )}
                  {!isOwner && (
                  <div>
                    <img
                      src={chatButton}
                      alt="chat with user"
                      className="chatWithUserBtn"
                    />
                  </div>
                  )}
                </form>
              </div>
            )}
          </section>
        </>
      )}
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
