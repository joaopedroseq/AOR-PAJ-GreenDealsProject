import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//UserStore responsável pela gestão de utilizadores logged
export const useUserStore = create(
  persist(
    //default set - sem qualquer utilizador logged
    (set) => ({   
      token: null,
      isAuthenticated: false,
      //operação de fazer update do token após login
      updateToken: (token) => set({ token }),   //apenas o token é guardado
      //boolean para facilitar operações que requerem autenticação
      updateIsAuthenticated: () => set({ isAuthenticated: true }),
      //operação de logout - clear da userStore
      clearUserStore: () => {
        set({
          token: null,
          isAuthenticated: false,
        });
        //E remoção do session storage
        sessionStorage.removeItem("userLogged");
      },
    }),
    //presistência dos dados no session storage - token e boolean isAuthenticated
    {
      name: "userLogged",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;