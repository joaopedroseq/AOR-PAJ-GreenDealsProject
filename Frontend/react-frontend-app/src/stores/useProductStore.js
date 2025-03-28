import { create } from "zustand";
import { getProducts } from "../api/productApi";

const useProductStore = create((set, get) => ({
  //Store para gestão de produtos
  products: [],
  //Base de filtros
  filters: {          //os filtros são utilizados para fetch dos produtos do backend
    username: null,
    excluded: null,
    edited: null,
    category: null,
    state: null,
    parameter: null,
    order: null,
  },
  //Flag boolean ativado quando é adicionado um produto para fazer novo fetch dos produtos
  productAddedFlag: false,
  setProductAddedFlag: (value) => set({ productAddedFlag: value }),

  //Set dos filtros de acordo com a página em que o utilizador está e se é admin ou não
  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      console.log("Updated Filters:", updatedFilters);
      return { filters: updatedFilters };
    }),

    //Limpeza dos filtros - previamente ao set de novos filtros
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
  
    

  // Fetch dos produtos - que pode ser chamado após determinadas operações
  fetchProducts: async (token) => {
    const { filters } = get(); // Access the current filters from the state

    try {
      const products = await getProducts(filters, token);
      set({ products }); // Update dos produtos na store
      set({ refetchProducts: false})  //E remoção da flag de atualização
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  },
}));

export default useProductStore;