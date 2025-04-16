import React from "react";
import "./confirmationModal.css";
import { useIntl } from "react-intl";

const ConfirmationModal = ({
  isOpen,
  title,
  message1,
  message2,
  onConfirm,
  onClose,
}) => {
  const intl = useIntl(); // Initialize intl for translations

  return (
    isOpen && (
      <div id="modal-confirmation" className="modal-ConfirmModal">
        <div className="modal-content-ConfirmModal">
          <div
            className="modal-header-ConfirmModal"
            id="modal-header-ConfirmModal"
          >
            <p className="modal-title-ConfirmModal">{title}</p>
            <p
              className="close-ConfirmModal"
              id="close-detail"
              onClick={onClose}
            >
              &times;
            </p>
          </div>
          <div className="modal-body-ConfirmModal">
            <p className="modal-message1-confirmation">{message1}</p>
            <p className="modal-message2-confirmation">{message2}</p>
            <div className="confirmModalButtons">
              <button className="confirm-button" type="button" onClick={onConfirm}>
                {intl.formatMessage({ id: "confirmationModalConfirmButton" })}
              </button>
              <button className="cancel-button" type="button" onClick={onClose}>
                {intl.formatMessage({ id: "confirmationModalCancelButton" })}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ConfirmationModal;
