import { create } from "zustand";
import { fetchCategories } from "../api/categoryApi";
import { showErrorToast } from '../Utils/ToastConfig/toastConfig';


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
  
    
    /*adicionar: ,addCategory: (newCategory) => {
    set((state) => ({
      categories: [...state.categories, newCategory],
    }
  };*/
})
);

export default useCategoriesStore;