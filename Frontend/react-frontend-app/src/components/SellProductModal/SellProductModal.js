import React from "react";
import "./sellProductModal.css";
import { useForm } from "react-hook-form";
import {
  showErrorToast,
  showSuccessToast,
} from "../../Utils/ToastConfig/toastConfig";
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
    Object.keys(errors).forEach((errorKey) => {
      handleNotification(intl, "error", `sellProductModalError${errorKey}`);
    });
  };

  //Modal para adicionar produto - provavelmente mover para assets ou outro component
  return (
    isProductModalVisible && (
      <div id="modal-addProduct" className="modal-addProduct">
        {/*Modal content*/}
        <div className="modal-content-addProduct">
          <div className="modal-header-addProduct" id="modal-header-addProduct">
            <p className="modal-header-addProduct-title">{intl.formatMessage({ id: 'sellProductModalTitle' })}</p>
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
              {[
                {
                  id: "productName",
                  label: "sellProductModalProductNameLabel",
                  placeholder: "sellProductModalProductNamePlaceholder",
                  maxLength: 30,
                },
                {
                  id: "productDescription",
                  label: "sellProductModalProductDescriptionLabel",
                  placeholder: "sellProductModalProductDescriptionPlaceholder",
                  maxLength: 100,
                },
                {
                  id: "productPrice",
                  label: "sellProductModalProductPriceLabel",
                  placeholder: "sellProductModalProductPricePlaceholder",
                  maxLength: 10,
                  validation: checkIfNumeric,
                },
                {
                  id: "productLocation",
                  label: "sellProductModalProductLocationLabel",
                  placeholder: "sellProductModalProductLocationPlaceholder",
                  maxLength: 100,
                },
                {
                  id: "productUrlImage",
                  label: "sellProductModalProductImageUrlLabel",
                  placeholder: "sellProductModalProductImageUrlPlaceholder",
                },
              ].map(({ id, label, placeholder, maxLength, validation }) => (
                <div className="add-product-form-field" key={id}>
                  <label htmlFor={id}>
                    {intl.formatMessage({ id: label })}
                  </label>
                  <input
                    type="text"
                    id={`add-${id}`}
                    name={`add-${id}`}
                    placeholder={intl.formatMessage({ id: placeholder })}
                    maxLength={maxLength}
                    {...register(id, {
                      required: intl.formatMessage({
                        id: `sellProductModalError${id}Required`,
                      }),
                      validate: validation
                        ? (value) =>
                            validation(value) ||
                            intl.formatMessage({
                              id: `sellProductModalErrorInvalid${id}`,
                            })
                        : undefined,
                    })}
                  />
                </div>
              ))}
              <div
                className="add-product-form-field"
                id="add-product-form-field"
              >
                <label htmlFor="add-categoria">{intl.formatMessage({ id: 'sellProductModalProductCategoryLabel' })}</label>
                <select
                  id="add-categoria"
                  name="add-categoria"
                  {...register("productCategory", {
                    required: "Terá de escoher uma categoria",
                  })}
                >
                  <option value="" disabled>
                  {intl.formatMessage({ id: 'sellProductModalProductCategoryPlaceholder' })}
                  </option>
                  {renderCategoryDropdown(displayedCategories, locale)}
                </select>
              </div>
              <div className="add-product-form-field">
                <label htmlFor="add-imagem">{intl.formatMessage({ id: 'sellProductModalProductStateLabel' })}</label>
                <select
                  id="addState"
                  name="addState"
                  defaultValue=""
                  {...register("productState")}
                >
                  <option value="" disabled>
                    {intl.formatMessage({
                      id: "sellProductModalSelectStatePlaceholder",
                    })}
                  </option>
                  {["RASCUNHO", "DISPONIVEL"].map((state) => (
                    <option key={state} value={state}>
                      {productStateTranslations[locale][state]}
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
