import React from "react";
import "./confirmationModal.css";

const AddCategoryModal = ({ title, message, isOpen, onClose, onConfirm }) => {
  const handleSubmit = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Algo correu mal:", error);
    }
  };


  return (
    <div
      id="modal-addCategory"
      className="modal-AddCategoryModal"
      style={{ display: isOpen ? "flex" : "none" }}
    >
      <div className="modal-content-AddCategoryModal">
        <div
          className="modal-header-AddCategoryModal"
          id="modal-header-AddCategoryModal"
        >
          <p className="modal-header-AddCategoryModal-title">
            {title}
          </p>
        </div>
        <div className="modal-body-AddCategoryModal">
          <p>{message}</p>
          <button
            className="confirm-button"
            onClick={handleSubmit}
          >
            Confirmar
          </button>
          <button
            className="cancel-button"
            onClick={onClose}
          >
            Cancelar
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
