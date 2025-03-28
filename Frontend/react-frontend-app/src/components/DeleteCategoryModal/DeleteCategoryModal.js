import React from "react";
import "./deleteCategoryModal.css";
import { showErrorToast } from "../../Utils/ToastConfig/toastConfig";

const DeleteCategoryModal = ({ Category, isOpen, onClose, onConfirm }) => {
  const onSubmit = async () => {
    try {
      await onConfirm(); //callback
    } catch (error) {
      console.error("Error while confirming:", error);
      showErrorToast("Algo correu mal");
    }
  };

  return (
    <div
      id="modal-addCategory"
      className="modal-DeleteCategoryModal"
      style={{ display: isOpen ? "flex" : "none" }}
    >
      <div className="modal-content-DeleteCategoryModal">
        <div
          className="modal-header-DeleteCategoryModal"
          id="modal-header-DeleteCategoryModal"
        >
          <p className="modal-header-DeleteCategoryModal-title">
            Apagar categoria
          </p>
        </div>
        <div className="modal-body-DeleteCategoryModal">
          <p>
            Deseja apagar a categoria {Category.name}?
          </p>
          {Category.products.length > 0 ? 
          <p>
          Esta catogoria tem {Category.products.length} produtos<br></br>que ficarão sem qualquer categoria - empty.
          </p>
          :
          null
          }
          <button
            type="button"
            className="submit"
            id="submit"
            onClick={onSubmit}
          >
            Confirmo
          </button>
          <button className="cancel" type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
