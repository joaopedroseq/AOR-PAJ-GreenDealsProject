import { create } from "zustand";
import { fetchCategories, addCategory, deleteCategory } from "../Api/categoryApi";
import { showErrorToast } from '../Utils/ToastConfig/toastConfig';
import errorMessages from "../Utils/constants/errorMessages";
import useLocaleStore from "./useLocaleStore";


export const useCategoriesStore = create((set, get) => ({
  //Store para a gestão de categorias
  categories: [],
  locale: useLocaleStore.getState().locale,
  

  //operação de get das categorias para popular a store
  fetchCategories: async () => {
    console.log("ran fetch categories");
    const locale = get().locale; // Get the latest locale dynamically
    console.log("Using locale:", locale);

    try {
      const allCategories = await fetchCategories(locale);
      set({ categories: allCategories });
    } catch (error) {
      showErrorToast("Failed to fetch categories");
      console.log(error);
    }
},

  //Operação de Admin para adicionar categoria
  handleAddCategory: async(token, newCategoryName) => {
    const newCategory = {
      nome: newCategoryName
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
}
)
);

useLocaleStore.subscribe(
  (state) => {
    return state.locale;
  },
  (newLocale) => {
    useCategoriesStore.setState({ locale: newLocale });
    useCategoriesStore.getState().fetchCategories();
  }
);

export default useCategoriesStore;