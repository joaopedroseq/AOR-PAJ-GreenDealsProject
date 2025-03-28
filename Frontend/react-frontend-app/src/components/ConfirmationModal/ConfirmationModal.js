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
    isOpen && (
    <div
      id="modal-addCategory"
      className="modal-ConfirmModal"
    >
      <div className="modal-content-ConfirmModal">
        <div
          className="modal-header-ConfirmModal"
          id="modal-header-ConfirmModal"
        >
          <p className="modal-header-ConfirmModal-title">
            {title}
          </p>
        </div>
        <div className="modal-body-ConfirmModal">
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
    )
  );
};

export default AddCategoryModal;
