import { create } from "zustand";

// Store responsável pela gestão do idioma
export const useLocaleStore = create((set) => ({
  locale: "pt",
  setLocale: (newLocale) => {
    set({ locale: newLocale });
  },
}));

export default useLocaleStore;