import React from "react";
import "./productModal.css";
import { useForm } from "react-hook-form";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastConfig/toastConfig";
import { checkIfNumeric } from "../../Utils/utilityFunctions";
import { addProduct } from "../../api/userApi";
import { getUserInformation } from "../../api/userApi";

const ProductModal = ({
  categories,
  toggleProductModal,
  isProductModalVisible,
  token,
}) => {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const getUsername = async() => {
    try {
      const user = await getUserInformation(token);
      return user.username;
    }
    catch(error){
      console.error("Failed to get username:", error);
      return;
    }
  }

  const onSubmit = async (registerProduct) => {
    const username = await getUsername();
    const newProduct = {
      seller: username,
      name: registerProduct.productName,
      description: registerProduct.productDescription,
      price: registerProduct.productPrice,
      category: registerProduct.category,
      location: registerProduct.location,
      urlImage: registerProduct.urlImage,
    };

    try {
      await addProduct(newProduct, username, token);
      showSuccessToast(
        "O seu produto foi adicionado como RASCUNHO\nPara alterar, edite o produto na sua página pessoal"
      );
      reset();
      toggleProductModal();
    } catch (error) {
      if (error.message === "invalid_data") {
        showErrorToast("dados inválidos");
        toggleProductModal();
        return;
      }
      if (error.message === "invalid_token") {
        showErrorToast("Token inválido, por favor tente novamente");
        toggleProductModal();
        return;
      }
      if (error.message === "permission_denied") {
        showErrorToast("Sem permissão para o fazer, por favor tente novamente");
        toggleProductModal();
        return;
      }
      if (error.message === "existant") {
        showErrorToast("Categoria inexistente, por favor tente novamente");
        toggleProductModal();
        return;
      }
      if (error.message === "failed") {
        showErrorToast("Adicionar producto falhou, por favor tente novamente");
        toggleProductModal();
        return;
      }
      showErrorToast("Adicionar produto falhou. Tente novamente");
      toggleProductModal();
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
      showErrorToast(errors.category.message);
    }
    if (errors.location) {
      showErrorToast(errors.location.message);
    }
    if (errors.urlImage) {
      showErrorToast(errors.urlImage.message);
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
          <p className="modal-header-addProduct-title">
            Definir informação do produto
          </p>
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
                maxLength="30"
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
                {...register("category", {
                  required: "Para se registar terá de escoher uma categoria",
                })}
              >
                <option value="" disabled>
                  Escolha uma categoria
                </option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
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
                maxLength="30"
                {...register("location", {
                  required:
                    "Para se registar terá de preencher a sua localidade",
                })}
              />
            </div>
            <div className="add-product-form-field" id="add-product-form-field">
              <label htmlFor="add-imagem">url de imagem:</label>
              <input
                type="text"
                id="add-imagem"
                name="add-imagem"
                {...register("urlImage", {
                  required:
                    "Para se registar terá de preencher o url da imagem do producto",
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