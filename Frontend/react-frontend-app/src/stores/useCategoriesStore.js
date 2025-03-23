import { create } from "zustand";
import { fetchCategories } from "../api/categoryApi";
import { showErrorToast } from '../Utils/ToastConfig/toastConfig';
import { all } from "axios";


export const useCategoriesStore = create((set) => ({
  categories: [],
  fetchCategories: async() => {
    try{
      const allCategories = await fetchCategories();
      console.log(allCategories)
      set({categories: allCategories});
    }
    catch(error) {
      showErrorToast("Failed to fetch categories");
      console.log(error);
    }
  }
    
    /*adicionar: ,addCategory: (newCategory) => {
    set((state) => ({
      categories: [...state.categories, newCategory],
    }
  };*/
}));