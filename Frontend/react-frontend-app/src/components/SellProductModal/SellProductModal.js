import React from "react";
import "./sellProductModal.css";
import { useForm } from "react-hook-form";

import { checkIfNumeric } from "../../Utils/utilityFunctions";
import { addProduct } from "../../Api/productApi";
import { useCategoriesStore } from "../../Stores/useCategoriesStore";
import useProductStore from "../../Stores/useProductStore";
import useUserStore from "../../Stores/useUserStore";
import { useIntl } from "react-intl";
import { renderCategoryDropdown } from "../../Handles/renderCategoryDropdown";
import { productStateTranslations } from "../../Utils/translations/productStateTranslation";
import handleNotification from "../../Handles/handleNotification";

const ProductModal = ({
  toggleProductModal,
  isProductModalVisible,
  token,
  locale,
}) => {
  const { register, handleSubmit, reset } = useForm();
  const { isAuthenticated } = useUserStore((state) => state);

  //Intl
  const intl = useIntl();
  const displayedCategories = useCategoriesStore(
    (state) => state.displayedCategories
  );

  //Submissão do formulário para novo produto
  const onSubmit = async (registerProduct) => {
    if (isAuthenticated) {
      const newProduct = {
        name: registerProduct.productName,
        description: registerProduct.productDescription,
        price: registerProduct.productPrice,
        category: JSON.parse(registerProduct.productCategory),
        location: registerProduct.productLocation,
        urlImage: registerProduct.productUrlImage,
        state: registerProduct.productState,
      };

      try {
        await addProduct(newProduct, token);
        handleNotification(intl, "success", "sellProductModalSuccessMessage");
        useProductStore.getState().setProductAddedFlag(true);
        reset(); // Reset form
        toggleProductModal(); // Close modal
      } catch (error) {
        handleNotification(
          intl,
          "error",
          `error${error.message}`,
          {},
          intl.formatMessage({ id: "errorUnexpected" })
        );
        reset();
        return;
      }
    } else {
      handleNotification(intl, "error", "sellProductModalAuthError");
    }
  };

  // informação ao utilizador sobre erros
  const onError = (errors) => {
    Object.entries(errors).forEach(([errorKey, errorValue]) => {
      handleNotification(intl, "error", errorValue.message);
    });
  };

  //Modal para adicionar produto - provavelmente mover para assets ou outro component
  return (
    isProductModalVisible && (
      <div id="modal-addProduct" className="modal-addProduct">
        {/*Modal content*/}
        <div className="modal-content-addProduct">
          <div className="modal-header-addProduct" id="modal-header-addProduct">
            <p className="modal-header-addProduct-title">
              {intl.formatMessage({ id: "sellProductModalTitle" })}
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
              <div
                className="add-product-form-field"
                id="add-product-form-field"
              >
                <label htmlFor="add-nome">
                  {intl.formatMessage({
                    id: "sellProductModalProductNameLabel",
                  })}
                </label>
                <input
                  type="text"
                  id="add-nome"
                  name="add-nome"
                  maxLength="30"
                  placeholder="nome"
                  {...register("productName", {
                    required: "sellProductModalErrorproductNameRequired",
                  })}
                />
              </div>
              <div
                className="add-product-form-field"
                id="add-product-form-field"
              >
                <label htmlFor="add-descricao">
                  {intl.formatMessage({
                    id: "sellProductModalProductDescriptionLabel",
                  })}
                </label>
                <input
                  type="text"
                  id="add-descricao"
                  name="add-descricao"
                  maxLength="100"
                  placeholder="descrição"
                  {...register("productDescription", {
                    required: "sellProductModalErrorproductDescriptionRequired",
                  })}
                />
              </div>
              <div
                className="add-product-form-field"
                id="add-product-form-field"
              >
                <label htmlFor="add-preco">
                  {intl.formatMessage({
                    id: "sellProductModalProductPriceLabel",
                  })}
                </label>
                <input
                  type="text"
                  id="add-preco"
                  name="add-preco"
                  maxLength="10"
                  placeholder="preço"
                  {...register("productPrice", {
                    required: "sellProductModalErrorproductPriceRequired",
                    validate: (value) =>
                      checkIfNumeric(value) ||
                      "sellProductModalErrorInvalidProductPrice",
                  })}
                />
              </div>

              <div
                className="add-product-form-field"
                id="add-product-form-field"
              >
                <label htmlFor="add-categoria">
                  {intl.formatMessage({
                    id: "sellProductModalProductCategoryLabel",
                  })}
                </label>
                <select
                  id="add-categoria"
                  name="add-categoria"
                  {...register("productCategory")}
                >
                  <option value="" disabled>
                    {intl.formatMessage({
                      id: "sellProductModalProductCategoryPlaceholder",
                    })}
                  </option>
                  {renderCategoryDropdown(displayedCategories, locale)}
                </select>
              </div>

              <div
                className="add-product-form-field"
                id="add-product-form-field"
              >
                <label htmlFor="add-localidade">
                  {intl.formatMessage({
                    id: "sellProductModalProductLocationLabel",
                  })}
                </label>
                <input
                  type="text"
                  id="add-localidade"
                  name="add-localidade"
                  placeholder="morada"
                  maxLength="100"
                  {...register("productLocation", {
                    required: "registerModalErrorfirstName",
                  })}
                />
              </div>
              <div
                className="add-product-form-field"
                id="add-product-form-field"
              >
                <label htmlFor="add-imagem">
                  {intl.formatMessage({
                    id: "sellProductModalProductImageUrlLabel",
                  })}
                </label>
                <input
                  type="text"
                  id="add-imagem"
                  name="add-imagem"
                  placeholder="url"
                  {...register("productUrlImage", {
                    required: "sellProductModalErrorproductUrlImageRequired",
                  })}
                />
              </div>
              <div className="add-product-form-field">
                <label htmlFor="add-imagem">
                  {intl.formatMessage({
                    id: "sellProductModalProductStateLabel",
                  })}
                </label>
                <select
                  id="addState"
                  name="addState"
                  defaultValue=""
                  {...register("productState")}
                >
                  <option value="" disabled>
                    {intl.formatMessage({
                      id: "editProductModalSelectStatePlaceholder",
                    })}
                  </option>
                  {[
                    { label: "RASCUNHO", value: "DRAFT" },
                    { label: "DISPONIVEL", value: "AVAILABLE" },
                  ].map((state) => (
                    <option key={state.value} value={state.value}>
                      {productStateTranslations[locale][state.label]}
                    </option>
                  ))}
                </select>
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
    )
  );
};

export default ProductModal;
