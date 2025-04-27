import React, { useState, useEffect } from "react";
import placeholder from "../../Assets/placeholder/item.png";
import "./user.css";
import { useForm } from "react-hook-form";
import { getLoggedUserInformation } from "../../Handles/handleLogin";
import useUserStore from "../../Stores/useUserStore";
import ProductCard from "../../Components/ProductCard/ProductCard";
import useProductStore from "../../Stores/useProductStore";
import {
  checkIfValidName,
} from "../../Utils/utilityFunctions.js";
import ConfirmPasswordModal from "../../Components/ConfirmPasswordModal/ConfirmPasswordModal";
import ChangePasswordModal from "../../Components/ChangePasswordModal/ChangePasswordModal";
import useLocaleStore from "../../Stores/useLocaleStore";
import { useIntl } from "react-intl";
import handleNotification from "../../Handles/handleNotification.js";
import { requestPasswordReset } from "../../Api/authenticationApi.js";
import ConfirmationModal from "../../Components/ConfirmationModal/ConfirmationModal";

//Página de utilizador
export const User = () => {
  //Opções de língua
  const intl = useIntl();
  const locale = useLocaleStore((state) => state.locale);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const token = useUserStore((state) => state.token);
  const [userInfo, setUserInfo] = useState({});
  const [updatedUserInfo, setUpdatedUserInfo] = useState({});
  const { setFilters } = useProductStore();
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);
  const addedProductFlag = useProductStore((state) => state.productAddedFlag);
  const [isConfirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

  //Confirmation Modal
  const [modalConfig, setModalConfig] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async (editedInformation) => {
    setUpdatedUserInfo(editedInformation);
    setConfirmPasswordOpen(true);
  };

  const handleChangePassword = async () =>{
    const passwordResetToken = await requestPasswordReset(token);
    const passwordResetLink = `localhost:3000/reset?token=${passwordResetToken}`;
    if (!document.hasFocus()) {
      console.error("Document not focused, clipboard write aborted.");
    }
    navigator.clipboard.writeText(passwordResetLink)
      .then(() => handleNotification(intl, "info", "registerModalActivationLinkCopied"))
      .catch((err) => console.error("Clipboard error:", err));    
    setModalConfig({
      title: intl.formatMessage({ id: "passwordResetRequestTitle" }),
      message1: intl.formatMessage({
        id: "passwordResetRequestMessage",
      }),
      message2: passwordResetLink,
      onConfirm: () => {
        setModalConfig({});
        setIsModalOpen(false);
      },
    });
  setIsModalOpen(true);
  }

  // Apresentação de erros no formulário ao utilizador
  const onError = (errors) => {
    Object.keys(errors).forEach((errorKey) => {
      handleNotification(intl, "error", `user${errorKey}Required`);
    });
  };

  //Use effect na abertura da página - buscar todos os dados do utilizador(informações e produtos)
  useEffect(() => {
    const getUserProducts = async () => {
      try {
        let userInformation = await getLoggedUserInformation(token, intl);
        setUserInfo(userInformation);
  
        let seller = userInformation.username;
        let isAdmin = userInformation.admin;
        let excluded = !isAdmin ? false : null;
        let state = "DRAFT";
  
        setFilters({ seller, excluded, state });
        await fetchProducts(token);
  
        if (addedProductFlag) {
          useProductStore.getState().setProductAddedFlag(false);
        }
      } catch (error) {
        handleNotification(intl, "error", `error${error.message}`);
      }
    };
  
    getUserProducts();
  }, [addedProductFlag]);  // Consolidated into a single effect

  return (
    <div className="user-main-content">
      <section className="products-section" id="products-section">
        <h3>{intl.formatMessage({ id: "userMyProductsTitle" })}</h3>
        <div className="grid-container">
          {products.length === 0 ? (
            <div className="grid-item no-products">
              <img src={placeholder} alt={intl.formatMessage({ id: "userNoProductsAlt" })} />
              <div className="text-overlay">
                <h2>{intl.formatMessage({ id: "userNoProductsHeading" })}</h2>
                <p>{intl.formatMessage({ id: "userNoProductsMessage" })}</p>
              </div>
            </div>
          ) : (
            products.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)
          )}
        </div>
      </section>
  
      <section className="profile-section" id="profile-section">
        <h3>{intl.formatMessage({ id: "userPersonalInfoTitle" })}</h3>
        {userInfo?.username && (
          <div id="user-info-container">
            <form className="edit-form" id="edit-form" onSubmit={handleSubmit(onSubmit, onError)}>
              <div className="edit-userinfo-form-field">
                <img className="user-profile-photo" src={userInfo.url} alt={intl.formatMessage({ id: "userProfilePhotoAlt" })} />
              </div>
              <div className="edit-userinfo-form-field">
                <label>{intl.formatMessage({ id: "userFirstNameLabel" })}</label>
                <input
                  type="text"
                  id="edit-firstname"
                  maxLength="20"
                  defaultValue={userInfo.firstName}
                  {...register("firstName", {
                    required: intl.formatMessage({ id: "userFirstNameRequired" }),
                    validate: (value) =>
                      checkIfValidName(value) || intl.formatMessage({ id: "userFirstNameInvalid" }),
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>{intl.formatMessage({ id: "userLastNameLabel" })}</label>
                <input
                  type="text"
                  id="edit-lastname"
                  maxLength="20"
                  defaultValue={userInfo.lastName}
                  {...register("lastName", {
                    required: intl.formatMessage({ id: "userLastNameRequired" }),
                    validate: (value) =>
                      checkIfValidName(value) || intl.formatMessage({ id: "userLastNameInvalid" }),
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>{intl.formatMessage({ id: "userEmailLabel" })}</label>
                <input
                  type="text"
                  id="edit-email"
                  maxLength="40"
                  defaultValue={userInfo.email}
                  {...register("email", {
                    required: intl.formatMessage({ id: "userEmailRequired" }),
                    validate: (value) =>
                      value.includes("@") || intl.formatMessage({ id: "userEmailInvalid" }),
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>{intl.formatMessage({ id: "userPhoneLabel" })}</label>
                <input
                  type="text"
                  id="edit-phone"
                  maxLength="20"
                  defaultValue={userInfo.phoneNumber}
                  {...register("phoneNumber", {
                    required: intl.formatMessage({ id: "userPhoneRequired" }),
                    validate: (value) =>
                      /^\d{9}$/.test(value) || intl.formatMessage({ id: "userPhoneInvalid" }),
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>{intl.formatMessage({ id: "userPhotoUrlLabel" })}</label>
                <input
                  type="url"
                  id="edit-photoUrl"
                  defaultValue={userInfo.url}
                  {...register("url", {
                    required: intl.formatMessage({ id: "userPhotoUrlRequired" }),
                  })}
                />
              </div>
              <input
                type="submit"
                id="guardarAlteracoesUser-btn"
                className="guardarAlteracoesUser-btn"
                value={intl.formatMessage({ id: "userSaveChangesButton" })}
              />
              <input
                type="button"
                id="alterarPassword-btn"
                className="alterarPassword-btn"
                value={intl.formatMessage({ id: "userChangePasswordButton" })}
                onClick={handleChangePassword}
              />
            </form>
          </div>
        )}
      </section>
      <ConfirmationModal
        title={modalConfig.title}
        message1={modalConfig.message1}
        message2={modalConfig.message2}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
      />
      <ChangePasswordModal
        userInfo={userInfo}
        updatedUserInfo={updatedUserInfo}
        isOpen={isChangePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </div>
  );
};

export default User;