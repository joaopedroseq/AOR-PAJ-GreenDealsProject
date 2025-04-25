import { React } from "react";
import "./editProductModal.css";
import { useCategoriesStore } from "../../Stores/useCategoriesStore";
import { useForm } from "react-hook-form";import { updateProduct } from "../../Api/productApi";
import useUserStore from "../../Stores/useUserStore";
import { renderCategoryDropdown } from "../../Handles/renderCategoryDropdown";
import { useIntl } from "react-intl";
import { productStateTranslations } from "../../Utils/translations/productStateTranslation";
import handleNotification from "../../Handles/handleNotification";

const EditProductModal = ({
  product,
  toggleEditProductModal,
  isEditProductModalVisible,
  setIsProductUpdated,
  locale,
}) => {
  const intl = useIntl();
  const displayedCategories = useCategoriesStore(
    (state) => state.displayedCategories
  );
  const token = useUserStore((state) => state.token);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (editedInformation) => {
    const parsedCategory =
      typeof editedInformation.editCategory === "string"
        ? JSON.parse(editedInformation.editCategory)
        : editedInformation.editCategory;

    const editedProduct = {
      name: editedInformation.editName,
      description: editedInformation.editDescription,
      price: Number(editedInformation.editPrice),
      category: parsedCategory,
      location: editedInformation.editLocation,
      urlImage: editedInformation.editUrlImage,
      state: editedInformation.editState,
    };

    const updates = {};
    for (const attribute in editedProduct) {
      if (attribute === "category") {
        if (editedProduct.category.nome !== product.category.nome) {
          updates[attribute] = editedProduct[attribute];
        }
      } else if (editedProduct[attribute] !== product[attribute]) {
        updates[attribute] = editedProduct[attribute];
      }
    }
    if (Object.keys(updates).length === 0) {
      handleNotification(intl, "info", "editProductModalNoChanges");
      reset();
      toggleEditProductModal();
    } else {
      try {
        await updateProduct(updates, token, product.id);
        handleNotification(intl, "success", "editProductModalSuccessMessage");
        reset();
        setIsProductUpdated(true);
        toggleEditProductModal();
      } catch (error) {
        handleNotification(intl, "error", `error${error.message}`);
      }
    }
  };

  const onError = (errors) => {
    Object.keys(errors).forEach((errorKey) => {
      handleNotification(intl, "error", `editProductModalError${errorKey}`);
    });
  };

  if (!product) {
    return null;
  }

  return (
    isEditProductModalVisible &&
    product && (
      <div id="modal-detail" className="modal-detail">
        <div className="modal-content-detail">
          <div className="modal-header-detail" id="modal-header-detail">
            <p className="modal-header-detail-title">
              {intl.formatMessage({ id: "editProductModalTitle" })}
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
            <form
              className="edit-product-form"
              id="edit-product-form"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              {[
                {
                  id: "editName",
                  label: "editProductModalProductName",
                  defaultValue: product.name,
                  maxLength: 30,
                },
                {
                  id: "editDescription",
                  label: "editProductModalProductDescription",
                  defaultValue: product.description,
                  maxLength: 100,
                },
                {
                  id: "editPrice",
                  label: "editProductModalProductPrice",
                  defaultValue: product.price,
                  maxLength: 10,
                },
                {
                  id: "editLocation",
                  label: "editProductModalProductLocation",
                  defaultValue: product.location,
                  maxLength: 100,
                },
                {
                  id: "editUrlImage",
                  label: "editProductModalProductImageUrl",
                  defaultValue: product.urlImage,
                },
              ].map(({ id, label, defaultValue, maxLength }) => (
                <div className="edit-product-form-field" key={id}>
                  <label htmlFor={id}>
                    {intl.formatMessage({ id: label })}
                  </label>
                  <input
                    type="text"
                    id={id}
                    maxLength={maxLength}
                    defaultValue={defaultValue}
                    {...register(id, {
                      required: intl.formatMessage({
                        id: `editProductModalError${
                          id.charAt(0).toUpperCase() + id.slice(1)
                        }`,
                      }),
                    })}
                  />
                </div>
              ))}

              <div className="edit-product-form-field">
                <label htmlFor="editCategory">
                  {intl.formatMessage({
                    id: "editProductModalProductCategory",
                  })}
                </label>
                <select
                  id="editCategory"
                  defaultValue={JSON.stringify(product.category)}
                  {...register("editCategory", { required: true })}
                >
                  <option value="" disabled>
                    {intl.formatMessage({
                      id: "editProductModalSelectCategoryPlaceholder",
                    })}
                  </option>
                  {renderCategoryDropdown(displayedCategories, locale)}
                </select>
              </div>

              <div className="edit-product-form-field">
                <label htmlFor="editState">
                  {intl.formatMessage({ id: "editProductModalProductState" })}
                </label>
                <select
                  id="editState"
                  name="editState"
                  defaultValue={product.state}
                  {...register("editState")}
                >
                  <option value="" disabled>
                    {intl.formatMessage({
                      id: "editProductModalSelectStatePlaceholder",
                    })}
                  </option>
                  {[
                    { label: "RASCUNHO", value: "DRAFT" },
                    { label: "DISPONIVEL", value: "AVAILABLE" },
                    { label: "RESERVADO", value: "RESERVED" },
                  ].map((state) => (
                    <option key={state.value} value={state.value}>
                      {productStateTranslations[locale][state.label]}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="submit"
                className="save-product"
                id="save-product"
                value={intl.formatMessage({ id: "editProductModalSaveButton" })}
              />
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default EditProductModal;
