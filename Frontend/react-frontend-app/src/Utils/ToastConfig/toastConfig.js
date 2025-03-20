import { toast } from 'react-toastify';


// Example success toast
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  });
};

// Example error toast
export const showErrorToast = (message) => {
  toast.error(message, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  });
};

// Global info toast
export const showInfoToast = (message) => {
  toast.info(message, {
    position: 'top-left',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  });
};

// Global warning toast
export const showWarningToast = (message) => {
  toast.warn(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
