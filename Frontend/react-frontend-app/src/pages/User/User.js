import React, { useState, useEffect } from "react";
import placeholder from "../../Assets/placeholder/item.png";
import "./user.css";
import { useForm } from "react-hook-form";
import {
  showErrorToast,
} from "../../Utils/ToastConfig/toastConfig.js";
import { getLoggedUserInformation } from "../../Handles/handleLogin.js";
import useUserStore from "../../Stores/useUserStore.js";
import ProductCard from "../../Components/ProductCard/productCard.js";
import useProductStore from "../../Stores/useProductStore.js";
import errorMessages from "../../Utils/constants/errorMessages.js";
import {
  checkIfValidName,
} from "../../Utils/utilityFunctions.js";
import ConfirmPasswordModal from "../../Components/ConfirmPasswordModal/ConfirmPasswordModal.js";
import ChangePasswordModal from "../../Components/ChangePasswordModal/ChangePasswordModal.js";
import { useIntl } from "react-intl";

//Página de utilizador
export const User = () => {
  const intl = useIntl();
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

  const onSubmit = async (editedInformation) => {
    setUpdatedUserInfo(editedInformation);
    setConfirmPasswordOpen(true);
  };

  const handleChangePassword = () =>{
    setChangePasswordOpen(true);
  }

  // Apresentação de erros no formulário ao utilizador
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

  //Use effect na abertura da página - buscar todos os dados do utilizador(informações e produtos)
  useEffect(() => {
    const getUserProducts = async () => {
      try {
        let userInformation = await getLoggedUserInformation(token);
        setUserInfo(userInformation);
        let username = userInformation.username;
        let isAdmin = userInformation.admin;
        let excluded;
        if(!isAdmin){
          excluded = false;
        }
        setFilters({ username, excluded });
        await fetchProducts(token);

        if (addedProductFlag) {
          useProductStore.getState().setProductAddedFlag(false);
        }
      } catch (error) {
        const toastMessage =
          errorMessages[error.message] || errorMessages.unexpected_error;
        showErrorToast(toastMessage);
      }
    };
    getUserProducts();
  }, []);

  //Use effect na venda de um novo produto nesta página
  useEffect(() => {
    const getUserProducts = async () => {
      try {
        if (addedProductFlag || addedProductFlag === undefined) {
          let userInformation = await getLoggedUserInformation(token);
          let username = userInformation.username;
          let isAdmin = userInformation.admin;
          let excluded;
          if(!isAdmin){
          excluded = false;
          }
          setFilters({ username, excluded });
          await fetchProducts(token);
          useProductStore.getState().setProductAddedFlag(false);
        }
      } catch (error) {
        const toastMessage =
          errorMessages[error.message] || errorMessages.unexpected_error;
        showErrorToast(toastMessage);
      }
    };
    getUserProducts();
  }, [addedProductFlag]);

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
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
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
      <ConfirmPasswordModal
        userInfo={userInfo}
        updatedUserInfo={updatedUserInfo}
        isOpen={isConfirmPasswordOpen}
        onClose={() => setConfirmPasswordOpen(false)}
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