import { create } from "zustand";

// Store responsável pela gestão do idioma
export const useLocaleStore = create((set) => ({
  locale: "pt", // ✅ Default value

  setLocale: (newLocale) => {
    console.log("🌍 Setting new locale:", newLocale);
    set({ locale: newLocale });
  },
}));

export default useLocaleStore;