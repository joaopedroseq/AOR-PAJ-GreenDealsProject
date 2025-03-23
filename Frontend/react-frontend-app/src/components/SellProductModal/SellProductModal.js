import React from "react";
import "./sellProductModal.css";
import { useForm } from "react-hook-form";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastConfig/toastConfig";
import { checkIfNumeric } from "../../Utils/UtilityFunctions";
import { addProduct } from "../../api/productApi";
import { getUserLogged } from "../../api/userApi";
import { useCategoriesStore } from "../../stores/useCategoriesStore";
import errorMessages from "../../Utils/constants/errorMessages";

const ProductModal = ({ toggleProductModal, isProductModalVisible, token }) => {
  const { register, handleSubmit, reset } = useForm();

  //Categories from the useCategoriesStore
  const categories = useCategoriesStore((state) => state.categories);

  const getUsername = async () => {
    try {
      const user = await getUserLogged(token);
      return user.username;
    } catch (error) {
      console.error("Failed to get username:", error);
      return;
    }
  };

  const onSubmit = async (registerProduct) => {
    const username = await getUsername();
    const newProduct = {
      seller: username,
      name: registerProduct.productName,
      description: registerProduct.productDescription,
      price: registerProduct.productPrice,
      category: registerProduct.productCategory,
      location: registerProduct.productLocation,
      urlImage: registerProduct.productUrlImage,
    };

    try {
      await addProduct(newProduct, token);
      showSuccessToast(
        "O seu produto foi adicionado como RASCUNHO\nPara alterar, edite o produto na sua página pessoal"
      );
      reset();
      toggleProductModal();
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
      reset();
      return;
    }
  };

  // Handle validation errors
  const onError = (errors) => {
    if (errors.productName) {
      showErrorToast(errors.productName.message);
    }
    if (errors.productDescription) {
      showErrorToast(errors.productDescription.message);
    }
    if (errors.productPrice) {
      showErrorToast(errors.productPrice.message);
    }
    if (errors.category) {
      showErrorToast(errors.productCategory.message);
    }
    if (errors.location) {
      showErrorToast(errors.productLocation.message);
    }
    if (errors.urlImage) {
      showErrorToast(errors.productUrlImage.message);
    }
  };

  //Modal para adicionar produto - provavelmente mover para assets ou outro component
  return (
    <div
      id="modal-addProduct"
      className="modal-addProduct"
      style={{ display: isProductModalVisible ? "flex" : "none" }}
    >
      {/*Modal content*/}
      <div className="modal-content-addProduct">
        <div className="modal-header-addProduct" id="modal-header-addProduct">
          <p className="modal-header-addProduct-title">Vender um produto</p>
          <p
            className="close-addProduct"
            id="close-addProduct"
            onClick={toggleProductModal}
          >
            &times;
          </p>
        </div>
        <div className="modal-body-addProduct">
          <form
            className="add-product-form"
            id="add-product-form"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <div className="add-product-form-field" id="add-product-form-field">
              <label htmlFor="add-nome">Nome do Produto:</label>
              <input
                type="text"
                id="add-nome"
                name="add-nome"
                maxLength="30"
                {...register("productName", {
                  required: "Terá de preencher o nome do produto",
                })}
              />
            </div>
            <div className="add-product-form-field" id="add-product-form-field">
              <label htmlFor="add-descricao">Descrição:</label>
              <input
                type="text"
                id="add-descricao"
                name="add-descricao"
                maxLength="100"
                {...register("productDescription", {
                  required: "Terá de preencher uma descrição do produto",
                })}
              />
            </div>
            <div className="add-product-form-field" id="add-product-form-field">
              <label htmlFor="add-preco">Preço do Produto:</label>
              <input
                type="text"
                id="add-preco"
                name="add-preco"
                maxLength="10"
                {...register("productPrice", {
                  required: "Terá de preencher o preço do produto",
                  validate: (value) =>
                    checkIfNumeric(value) ||
                    "O preço apenas pode conter números",
                })}
              />
            </div>
            <div className="add-product-form-field" id="add-product-form-field">
              <label htmlFor="add-categoria">Categoria do Produto:</label>
              <select
                id="add-categoria"
                name="add-categoria"
                {...register("productCategory", {
                  required: "Terá de escoher uma categoria",
                })}
              >
                <option value="" disabled>
                  Escolha uma categoria
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-product-form-field" id="add-product-form-field">
              <label htmlFor="add-localidade">Localização:</label>
              <input
                type="text"
                id="add-localidade"
                name="add-localidade"
                maxLength="100"
                {...register("productLocation", {
                  required:
                    "Tterá de preencher uma localidade",
                })}
              />
            </div>
            <div className="add-product-form-field" id="add-product-form-field">
              <label htmlFor="add-imagem">url de imagem:</label>
              <input
                type="text"
                id="add-imagem"
                name="add-imagem"
                {...register("productUrlImage", {
                  required:
                    "Terá de preencher o url da imagem do producto",
                })}
              />
            </div>
            <input
              type="submit"
              className="save-addProduct"
              id="save-addProduct"
              value="Guardar Alterações"
            ></input>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
