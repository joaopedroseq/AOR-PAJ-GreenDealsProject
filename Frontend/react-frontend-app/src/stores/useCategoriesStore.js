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
    console.log(
      "Manual locale check inside script:",
      useLocaleStore.getState().locale
    );
    console.log("ran fetch categories");
    const locale = useLocaleStore.getState().locale;
    console.log("Using locale:", locale);

    try {
      const allCategories = await fetchCategories(locale);
      console.log(allCategories);
      set({ categories: allCategories });
      set({ displayedCategories: allCategories });
    } catch (error) {
      showErrorToast("Failed to fetch categories");
      console.log(error);
    }
  },
  
  sortByLocale: (locale) => {
    console.log("ran sort");

    const allCategories = get().categories;
    if (!Array.isArray(allCategories) || allCategories.length === 0) {
        console.error("⚠️ Categories list is empty or not an array, cannot sort.");
        return []; // ✅ Ensures function always returns an array
    }

    const sortedCategories = [...allCategories].sort((a, b) => 
        (locale === "pt" ? a.nome : a.nameEng).localeCompare(locale === "pt" ? b.nome : b.nameEng)
    );

    console.log("✅ Sorted categories:", sortedCategories);
    
    set({ displayedCategories: sortedCategories }); // ✅ Updates Zustand state

    return sortedCategories; // ✅ Ensures function returns sorted array
},

  //Operação de Admin para adicionar categoria
  handleAddCategory: async (token, newCategoryName) => {
    const newCategory = {
      nome: newCategoryName,
    };
    try {
      const response = await addCategory(token, newCategory);
      if (response.status === 200) {
        console.log("ok");
        return true;
      }
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
    }
  },

  //Operação de apagar uma categoria
  handleDeleteCategory: async (token, categoryToDelete) => {
    const category = {
      name: categoryToDelete.name,
    };
    try {
      const response = await deleteCategory(token, category);
      console.log(response);
      if (response.status === 200) {
        console.log("ok");
        return true;
      }
    } catch (error) {
      const toastMessage =
        errorMessages[error.message] || errorMessages.unexpected_error;
      showErrorToast(toastMessage);
    }
  },
}));

useLocaleStore.subscribe(
  (state) => state.locale,
  (locale) => {
    console.log("🔥 Locale changed, resorting categories...");
    const sortedCategories = useCategoriesStore.getState().sortByLocale(locale);
    useCategoriesStore.setState({ displayedCategories: sortedCategories });
  }
);

export default useCategoriesStore;
