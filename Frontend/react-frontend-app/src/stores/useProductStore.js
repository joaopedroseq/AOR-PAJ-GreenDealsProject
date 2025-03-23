import { create } from 'zustand';
import { getProducts } from '../api/productApi';

const useProductStore = create((set, get) => ({
  products: [],
  filters: {
    excluded: null,
    edited: null,
    category: null,
    state: null,
    parameter: null,
    order: null
  },

  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      console.log("Updated Filters:", updatedFilters);
      return { filters: updatedFilters };
    }),
  
  

  // Fetches products based on the current filters
  fetchProducts: async (token) => {
    const { filters } = get(); // Access the current filters from the state

    try {
      console.log(filters);
      const products = await getProducts(filters, token); // Call your API function
      set({ products }); // Update the products in the store
    } catch (error) {
      console.error('Failed to fetch products:', error.message);
    }
  },
}));

export default useProductStore;