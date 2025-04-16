import { showSuccessToast, showErrorToast } from "../Utils/ToastConfig/toastConfig";

const handleNotification = (intl, type, messageId, params = {}) => {

  const translatedMessage = intl.formatMessage({ id: messageId }, params);

  if (type === "success") {
    showSuccessToast(translatedMessage);
  } else if (type === "error") {
    showErrorToast(translatedMessage);
  }
};

export default handleNotification;