import { create } from "zustand";
import {
  fetchCategories,
  addCategory,
  deleteCategory,
} from "../Api/categoryApi";
import { showErrorToast } from "../Utils/ToastConfig/toastConfig";
import errorMessages from "../Utils/constants/errorMessages";
import useLocaleStore from "./useLocaleStore";

export const useCategoriesStore = create((set, get) => ({
  //Store para a gestão de categorias
  categories: [],
  displayedCategories: [],

  //operação de get das categorias para popular a store
  fetchCategories: async () => {
    const locale = useLocaleStore.getState().locale;
    try {
      const allCategories = await fetchCategories(locale);
      set({ categories: allCategories });
      set({ displayedCategories: allCategories });
    } catch (error) {
      showErrorToast("errorFailed to fetch categories");
      console.log(error);
    }
  },
  
  sortByLocale: (locale) => {
    const allCategories = get().categories;
    const sortedCategories = allCategories.sort((a, b) => 
          (locale === "pt" ? a.nome : a.nameEng).localeCompare(locale === "pt" ? b.nome : b.nameEng));
    set({ displayedCategories: sortedCategories });
},

  //Operação de Admin para adicionar categoria
  handleAddCategory: async (token, category) => {
    console.log(category);
    const newCategory = {
      nome: category.nome,
      nameEng: category.nameEng
    };
    try {
      const response = await addCategory(token, newCategory);
      if (response.status === 200) {
        console.log("ok");
        return true;
      }
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.errorUnexpected;
      showErrorToast(toastMessage);
    }
  },

  //Operação de apagar uma categoria
  handleDeleteCategory: async (token, categoryToDelete) => {
    const category = {
      name: categoryToDelete.nome,
    };
    console.log(category);
    try {
      const response = await deleteCategory(token, category);
      console.log(response);
      if (response.status === 200) {
        console.log("ok");
        return true;
      }
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.errorUnexpected;
      showErrorToast(toastMessage);
    }
  },
}));

useLocaleStore.subscribe(
  (state) => state.locale,
  (locale) => {
    const sortedCategories = useCategoriesStore.getState().sortByLocale(locale);
    useCategoriesStore.setState({ displayedCategories: sortedCategories });
  }
);

export default useCategoriesStore;
