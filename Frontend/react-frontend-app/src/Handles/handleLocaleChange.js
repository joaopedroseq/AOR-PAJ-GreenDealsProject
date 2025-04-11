import useLocaleStore from "../Stores/useLocaleStore";
import useCategoriesStore from "../Stores/useCategoriesStore"; // ✅ Ensure it's imported

export const handleLocaleChange = (locale) => {
    console.log("🔥 Locale changed, resorting categories...");
    const sortedCategories = useCategoriesStore.getState().sortByLocale(locale);

    if (!Array.isArray(sortedCategories)) {
        console.error("⚠️ sortedCategories is not an array, aborting update:", sortedCategories);
        return;
    }

    useCategoriesStore.setState({ displayedCategories: sortedCategories });
};

export default handleLocaleChange;