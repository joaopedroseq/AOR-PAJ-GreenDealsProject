import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//store de utilizador
export const userStore = create(
  persist((set) => ({
      token: null,
      isAuthenticated: false,
      updateToken: (token) => set({ token }),
      updateIsAuthenticated: () => set({ isAuthenticated: true }),
      clearUserStore: () => {
        set({
          token: null,
          isAuthenticated: false,
        });
        // Clear the persisted data from session storage
        sessionStorage.removeItem("userLogged");
      },
    }),
    {
      name: "userLogged", // the name to use for the persisted data
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default userStore;