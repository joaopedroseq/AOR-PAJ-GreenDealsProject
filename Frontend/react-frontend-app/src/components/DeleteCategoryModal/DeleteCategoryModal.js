import React from "react";
import "./deleteCategoryModal.css";
import { useIntl } from "react-intl";
import handleNotification from "../../Handles/handleNotification";

const DeleteCategoryModal = ({ Category, isOpen, onClose, onConfirm }) => {
  const intl = useIntl(); // Initialize intl for translations

  const onSubmit = async () => {
    try {
      await onConfirm(); // Callback
    } catch (error) {
      console.error("Error deleting category:", error);
      handleNotification(intl, "error", `error${error.message}`);
    }
  };

  return (
    isOpen && (
      <div id="modal-addCategory" className="modal-DeleteCategoryModal">
        <div className="modal-content-DeleteCategoryModal">
          <div className="modal-header-DeleteCategoryModal" id="modal-header-DeleteCategoryModal">
            <p className="modal-header-DeleteCategoryModal-title">
              {intl.formatMessage({ id: "deleteCategoryModalTitle" })}
            </p>
          </div>
          <div className="modal-body-DeleteCategoryModal">
            <p>{intl.formatMessage({ id: "deleteCategoryModalConfirmation" }, { categoryName: Category.name })}</p>
            {Category.products.length > 0 ? (
              <p>
                {intl.formatMessage({ id: "deleteCategoryModalWarning" }, { numProducts: Category.products.length })}
              </p>
            ) : null}
            <button type="button" className="submit" id="submit" onClick={onSubmit}>
              {intl.formatMessage({ id: "deleteCategoryModalConfirmButton" })}
            </button>
            <button className="cancel" type="button" onClick={onClose}>
              {intl.formatMessage({ id: "deleteCategoryModalCancelButton" })}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeleteCategoryModal;