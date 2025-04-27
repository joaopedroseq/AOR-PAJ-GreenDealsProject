import { create } from "zustand";

export const useUsersDataStore = create((set) => ({
    allUsers: [],
    filteredUsers: [],
  
    setAllUsers: (users) => set({ allUsers: users, filteredUsers: users }),
  
    setFilteredUsers: (filterFunction) =>
      set((state) => ({
        filteredUsers: state.allUsers.filter(filterFunction),
      })),
  }));
  
export default useUsersDataStore;