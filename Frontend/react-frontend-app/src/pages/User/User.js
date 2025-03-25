import React, { useState, useEffect } from "react";
import placeholder from "../../assets/placeholder/item.png";
import "./user.css";
import { useForm } from "react-hook-form";
import {
  showErrorToast,
} from "../../Utils/ToastConfig/toastConfig";
import { getUserInformation } from "../../hooks/handleLogin";
import userStore from "../../stores/UserStore";
import ProductCard from "../../components/ProductCard/productCard";
import useProductStore from "../../stores/useProductStore";
import errorMessages from "../../Utils/constants/errorMessages";
import {
  checkIfValidName,
} from "../../Utils/UtilityFunctions";
import ConfirmPasswordModal from "../../components/ConfirmPasswordModal/ConfirmPasswordModal";
import ChangePasswordModal from "../../components/ChangePasswordModal/ChangePasswordModal";

export const User = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const token = userStore((state) => state.token);
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

  // Handle validation errors
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

  //Use effect on component mount
  useEffect(() => {
    const getUserProducts = async () => {
      try {
        let userInformation = await getUserInformation(token);
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

  useEffect(() => {
    const getUserProducts = async () => {
      try {
        if (addedProductFlag || addedProductFlag === undefined) {
          let userInformation = await getUserInformation(token);
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
      <section className="products" id="products-section">
        <h3>Os meus produtos</h3>
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
      <section className="profile-section" id="profile-section">
        <h3>Informações Pessoais</h3>
        {userInfo?.username && (
          <div id="user-info-container">
            <form
              className="edit-form"
              id="edit-form"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              <div className="edit-userinfo-form-field">
                <label>Primeiro Nome:</label>
                <input
                  type="text"
                  id="edit-firstname"
                  maxLength="20"
                  defaultValue={userInfo.firstName}
                  {...register("firstName", {
                    required: "Terá de preencher o primeiro nome",
                    validate: (value) =>
                      checkIfValidName(value) ||
                      "O primeiro nome não deverá conter caracteres especiais",
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>Último Nome:</label>
                <input
                  type="text"
                  id="edit-lastname"
                  maxLength="20"
                  defaultValue={userInfo.lastName}
                  {...register("lastName", {
                    required: "Terá de preencher o apelido",
                    validate: (value) =>
                      checkIfValidName(value) ||
                      "O apelido não deverá conter caracteres especiais",
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>Email:</label>
                <input
                  type="email"
                  id="edit-email"
                  maxLength="40"
                  defaultValue={userInfo.email}
                  {...register("email", {
                    required: "Terá de preencher o seu email",
                    validate: (value) =>
                      value.includes("@") || "O seu email tem de conter um @",
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>Telefone:</label>
                <input
                  type="tel"
                  id="edit-phone"
                  maxLength="20"
                  defaultValue={userInfo.phoneNumber}
                  {...register("phoneNumber", {
                    required: "Terá de preencher o seu contacto telefónico",
                    validate: (value) =>
                      /^\d{9}$/.test(value) ||
                      "O seu número de telefone tem de conter pelo menos 9 digitos",
                  })}
                />
              </div>
              <div className="edit-userinfo-form-field">
                <label>Foto url:</label>
                <input
                  type="url"
                  id="edit-photoUrl"
                  defaultValue={userInfo.url}
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
              <input
                type="button"
                id="alterarPassword-btn"
                className="alterarPassword-btn"
                value="Alterar password"
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