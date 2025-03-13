import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//store de utilizador
export const userStore = create(
  persist(
    (set) => ({
      username: null,
      token: null,
      isAuthenticated: false,
      isAdmin: null,
      urlPhoto: null,
      firstName: null,
      updateUsername: (username) => set({ username }),
      updateToken: (token) => set({ token }),
      updateIsAuthenticated: () => set({ isAuthenticated: true }),
      updateIsAdmin: (isAdmin) => set({ isAdmin }),
      updateUrlPhoto: (urlPhoto) => set({ urlPhoto }),
      updateFirstName: (firstName) => set({ firstName }),
      clearUserStore: () => {
        set({
          username: null,
          token: null,
          isAuthenticated: false,
          isAdmin: null,
          urlPhoto: null,
          firstName: null,
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
