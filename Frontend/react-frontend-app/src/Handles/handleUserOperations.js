import handleNotification from "./handleNotification";
import handleGetAllUsers from "./handleGetAllUsers";
import handleExcludeUser from "./handleExcludeUser";
import handleDeleteUserProducts from "./handleDeleteUserProducts";
import handleDeleteUser from "./handleDeleteUser";

export const handleExcludingUser = async (
  token,
  user,
  setAllUsers,
  setIsModalOpen,
  fetchProducts,
  intl
) => {
  try {
    const response = await handleExcludeUser(token, user.username);
    if (response) {
      handleNotification(intl, "success", "adminExcludeUserSuccess", {
        username: user.username,
      });
      if (setAllUsers) {
        const users = await handleGetAllUsers(token);
        setAllUsers(users);
      }

      fetchProducts(token);
    }
  } catch (error) {
    handleNotification(intl, "error", `error${error.message}`);
  } finally {
    setIsModalOpen(false);
  }
};

export const handleDeletingUserProducts = async (
  token,
  user,
  setIsModalOpen,
  fetchProducts,
  intl
) => {
  console.log(user);
  try {
    const response = await handleDeleteUserProducts(token, user.username);
    if (response) {
      handleNotification(intl, "success", "adminRemoveUserProductsSuccess", {
        username: user.username,
      });
      fetchProducts(token);
    }
  } catch (error) {
    handleNotification(intl, "error", `error${error.message}`);
  } finally {
    setIsModalOpen(false);
  }
};

export const handleDeletingUser = async (
  token,
  user,
  setAllUsers,
  setIsModalOpen,
  navigate,
  fetchProducts,
  intl
) => {
  try {
    const response = await handleDeleteUser(token, user.username);
    if (response) {
      handleNotification(intl, "success", "adminDeleteUserSuccess", {
        username: user.username,
      });
      if (setAllUsers) {
        const users = await handleGetAllUsers(token);
        setAllUsers(users);
      }
        fetchProducts(token);
      }
      if (navigate) {
        navigate("/admin");
      }
  } catch (error) {
    handleNotification(intl, "error", `error${error.message}`);
  } finally {
    setIsModalOpen(false);
  }
};
