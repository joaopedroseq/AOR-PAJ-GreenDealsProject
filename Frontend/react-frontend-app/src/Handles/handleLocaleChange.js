import useLocaleStore from "../Stores/useLocaleStore";
import useCategoriesStore from "../Stores/useCategoriesStore"; // ✅ Ensure it's imported

export const handleLocaleChange = (newLocale) => {
    useLocaleStore.getState().setLocale(newLocale);
    useCategoriesStore.getState().sortByLocale(newLocale);
}

export default handleLocaleChange;