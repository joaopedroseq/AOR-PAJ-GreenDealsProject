import { create } from "zustand";
import { getProducts } from "../api/productApi";

const useProductStore = create((set, get) => ({
  products: [],
  filters: {
    username: null,
    excluded: null,
    edited: null,
    category: null,
    state: null,
    parameter: null,
    order: null,
  },
  productAddedFlag: false,
  setProductAddedFlag: (value) => set({ productAddedFlag: value }),

  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      console.log("Updated Filters:", updatedFilters);
      return { filters: updatedFilters };
    }),

    clearFilters: () => {
      set({
        filters: {
          username: null,
          excluded: null,
          edited: null,
          category: null,
          state: null,
          parameter: null,
          order: null,
        },
      });
    },
    
    setRefetchProducts: (value) => {
      set({ refetchProducts: value }); // Update the refetch flag
    },
  
    

  // Fetches products based on the current filters
  fetchProducts: async (token) => {
    const { filters } = get(); // Access the current filters from the state

    try {
      const products = await getProducts(filters, token); // Call your API function
      set({ products }); // Update the products in the store
      set({ refetchProducts: false})
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  },
}));

export default useProductStore;