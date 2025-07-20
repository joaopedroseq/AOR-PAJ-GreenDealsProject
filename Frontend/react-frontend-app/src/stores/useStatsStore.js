import { create } from "zustand";
import { getProductStatistics, getUserStatistics } from '../Api/statsApi';

const useStatsStore = create((set, get) => ({
  userStats: {
    totalUsers: 0,
    activeUsers: 0,
    newRegistrations: 0,
  },
  productStats: {
    totalProducts: 0,
    productsByState: {},
    productsByCategory: [],
    topLocations: {},
  },


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