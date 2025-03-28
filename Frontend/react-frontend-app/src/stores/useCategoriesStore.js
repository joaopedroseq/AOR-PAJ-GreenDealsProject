import { create } from "zustand";
import { fetchCategories, addCategory, deleteCategory } from "../api/categoryApi";
import { showSuccessToast, showErrorToast } from '../Utils/ToastConfig/toastConfig';
import errorMessages from "./../Utils/constants/errorMessages";


export const useCategoriesStore = create((set) => ({
  //Store para a gestão de categorias
  categories: [],
  //operação de get das categorias para popular a store
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

  //Operação de Admin para adicionar categoria
  handleAddCategory: async(token, newCategoryName ) => {
    const newCategory = {
      name: newCategoryName
    }
    try{
      const response = await addCategory(token, newCategory);
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

  //Operação de apagar uma categoria
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