import { create } from "zustand";

//UserStore responsável pela gestão de utilizadores logged
export const useLocaleStore = create((set) => ({
      //Lingua
      locale: 'pt',
      updateLocale: (locale) => {
        console.log(locale);
        set({ locale });
  }
}));



export default useLocaleStore;