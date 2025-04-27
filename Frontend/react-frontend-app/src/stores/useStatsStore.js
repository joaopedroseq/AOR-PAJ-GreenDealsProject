import { create } from "zustand";
import { getProductStatistics, getUserStatistics } from '../Api/statsApi';

const useStatsStore = create((set) => ({
  userStats: null,
  productStats: null,

  fetchUserStats: async (token) => {
    try {
      const response = await getUserStatistics(token);
      console.log(response)
      set({ userStats: response });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  },

  fetchProductStats: async (token) => {
    try {
      const response = await getProductStatistics(token);
      console.log(response)
      set({ productStats: response });
    } catch (error) {
      console.error("Error fetching product stats:", error);
    }
  }
}));

export default useStatsStore;