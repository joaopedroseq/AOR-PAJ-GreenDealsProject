export function renderCategoryDropdown(categories, locale) {
  return (
    <>
      {categories.map((category, index) => (
        <option key={index} value={JSON.stringify(category)}>
          {locale === "pt" ? category.nome : category.nameEng}
        </option>
      ))}
    </>
  );
}