import React from "react";
import "./editProductModal.css";
import { useCategoriesStore } from "../../stores/useCategoriesStore";
import { useForm } from "react-hook-form";
import { checkIfNumeric } from "../../Utils/utilityFunctions";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastConfig/toastConfig";
import { updateProduct } from "../../api/productApi";
import useUserStore from "../../stores/useUserStore";
import errorMessages from "../../Utils/constants/errorMessages";

const EditProductModal = ({
  product,
  toggleEditProductModal,
  isEditProductModalVisible,
  updatedProduct,
}) => {
  //Categories from the useCategoriesStore
  const categories = useCategoriesStore((state) => state.categories);
  const token = useUserStore((state) => state.token);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (editedInformation) => {
    const editedProduct = {
      name: editedInformation.editName,
      description: editedInformation.editDescription,
      price: Number(editedInformation.editPrice),
      category: editedInformation.editCategory,
      location: editedInformation.editLocation,
      urlImage: editedInformation.editUrlImage,
      state: editedInformation.editState,
    };
    const updates = {};
    for (const attribute in editedProduct) {
      if (editedProduct[attribute] !== product[attribute]) {
        updates[attribute] = editedProduct[attribute];
      }
    }
    try {
      await updateProduct(updates, token, product.id);
      showSuccessToast("Produto atualizado com sucesso");
      reset();
      updatedProduct();
      toggleEditProductModal();
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
      return;
    }
  };

  // Handle validation errors
  const onError = (errors) => {
    if (errors.editName) {
      showErrorToast(errors.editName.message);
    }
    if (errors.editDescription) {
      showErrorToast(errors.editDescription.message);
    }
    if (errors.editPrice) {
      showErrorToast(errors.editPrice.message);
    }
    if (errors.editCategory) {
      showErrorToast(errors.editCategory.message);
    }
    if (errors.editLocation) {
      showErrorToast(errors.editLocation.message);
    }
    if (errors.editUrlImage) {
      showErrorToast(errors.editUrlImage.message);
    }
    if (errors.editState) {
      showErrorToast(errors.editState.message);
    }
  };
  //Janela modal para alterar informações de um produto

  if (!product) {
    return null; //implementar loading
  }

  return (
    isEditProductModalVisible && (
    <div
      id="modal-detail"
      className="modal-detail"
    >
      {/*Conteúdo da janela modal*/}
      <div className="modal-content-detail">
        <div className="modal-header-detail" id="modal-header-detail">
          <p className="modal-header-detail-title">
            Alterar informações de produto
          </p>
          <p
            className="close-detail"
            id="close-detail"
            onClick={toggleEditProductModal}
          >
            &times;
          </p>
        </div>
        <div className="modal-body-detail">
          {/*Formulário de edição de informações de um produto*/}
          <form
            className="edit-product-form"
            id="edit-product-form"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <div
              className="edit-product-form-field"
              id="edit-product-form-field"
            >
              <label htmlFor="edit-nome">Nome do Produto:</label>
              <input
                type="text"
                id="edit-nome"
                name="edit-nome"
                maxLength="30"
                defaultValue={product.name}
                {...register("editName", {
                  required: "Terá de preencher o nome do produto",
                })}
              />
            </div>
            <div
              className="edit-product-form-field"
              id="edit-product-form-field"
            >
              <label htmlFor="edit-descricao">Descrição:</label>
              <input
                type="text"
                id="edit-descricao"
                name="edit-descricao"
                maxLength="100"
                defaultValue={product.description}
                {...register("editDescription", {
                  required: "Terá de preencher uma descrição do produto",
                })}
              />
            </div>
            <div
              className="edit-product-form-field"
              id="edit-product-form-field"
            >
              <label htmlFor="edit-preco">Preço do Produto:</label>
              <input
                type="text"
                id="edit-preco"
                name="edit-preco"
                maxLength="10"
                defaultValue={product.price}
                {...register("editPrice", {
                  required: "Terá de preencher o preço do produto",
                  validate: (value) =>
                    checkIfNumeric(value) ||
                    "O preço apenas pode conter números",
                })}
              />
            </div>
            <div
              className="edit-product-form-field"
              id="edit-product-form-field"
            >
              <label htmlFor="edit-categoria">Categoria do Produto:</label>
              <select
                id="edit-categoria"
                name="edit-categoria"
                defaultValue={product.category}
                {...register("editCategory", {
                  required: "Terá de escoher uma categoria",
                })}
              >
                <option value="" disabled>
                  Escolha uma categoria
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>
                    {category.name.charAt(0).toUpperCase() +
                      category.name.slice(1)}{" "}
                    {/* Display category.name */}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="edit-product-form-field"
              id="edit-product-form-field"
            >
              <label htmlFor="edit-localidade">Localização:</label>
              <input
                type="text"
                id="edit-localidade"
                name="edit-localidade"
                maxLength="100"
                defaultValue={product.location}
                {...register("editLocation", {
                  required: "Terá de preencher a sua localidade",
                })}
              />
            </div>
            <div
              className="edit-product-form-field"
              id="edit-product-form-field"
            >
              <label htmlFor="edit-imagem">url de imagem:</label>
              <input
                type="text"
                id="edit-imagem"
                name="edit-imagem"
                defaultValue={product.urlImage}
                {...register("editUrlImage", {
                  required: "Tterá de preencher o url da imagem do producto",
                })}
              />
            </div>
            <div
              className="edit-product-form-field"
              id="edit-product-form-field"
            >
              <label htmlFor="edit-state">Estado do artigo:</label>
              <select
                id="edit-state"
                name="edit-state"
                defaultValue={product.state}
                {...register("editState", {
                  required: "Terá de de definir um estado",
                })}
              >
                <option value="" disabled>
                  Escolha um estado
                </option>
                {product.state === "RASCUNHO" && (
                  <>
                    <option value="RASCUNHO">Rascunho</option>
                    <option value="DISPONIVEL">Disponível</option>
                    <option value="RESERVADO">Reservado</option>
                  </>
                )}
                {product.state === "DISPONIVEL" && (
                  <>
                    <option value="DISPONIVEL">Disponível</option>
                    <option value="RESERVADO">Reservado</option>
                  </>
                )}
                {product.state === "RESERVADO" && (
                  <>
                    <option value="DISPONIVEL">Disponível</option>
                    <option value="RESERVADO">Reservado</option>
                  </>
                )}
                {product.state === "COMPRADO" && (
                  <>
                    <option value="DISPONIVEL">Disponível</option>
                    <option value="RESERVADO">Reservado</option>
                  </>
                )}
              </select>
            </div>
            <input
              type="submit"
              className="save-product"
              id="save-product"
              value="Guardar Alterações"
            />
          </form>
        </div>
      </div>
    </div>
    )
  );
};

export default EditProductModal;
