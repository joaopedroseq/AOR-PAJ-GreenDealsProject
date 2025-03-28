import { create } from "zustand";
import { fetchCategories, addCategory, deleteCategory } from "../api/categoryApi";
import { showSuccessToast, showErrorToast } from '../Utils/ToastConfig/toastConfig';
import errorMessages from "./../Utils/constants/errorMessages";


export const useCategoriesStore = create((set) => ({
  categories: [],
  fetchCategories: async() => {
    try{
      const allCategories = await fetchCategories();
      set({categories: allCategories});
      
    }
    catch(error) {
      showErrorToast("Failed to fetch categories");
      console.log(error);
    }
  },

  handleAddCategory: async(token, newCategoryName ) => {
    console.log(newCategoryName);
    const newCategory = {
      name: newCategoryName
    }
    try{
      const response = await addCategory(token, newCategory);
      console.log(response);
      if(response.status === 200){
        console.log("ok")
        return true;
      }
            
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
    }
  },

  handleDeleteCategory: async(token, categoryToDelete ) => {
    const category = {
      name: categoryToDelete.name
    }
    try{
      const response = await deleteCategory(token, category);
      console.log(response);
      if(response.status === 200){
        console.log("ok")
        return true;
      }
            
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
    }
  }
})
);

export default useCategoriesStore;