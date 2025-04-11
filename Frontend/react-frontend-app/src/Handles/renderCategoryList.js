export function renderCategoryList(categories, locale, handleCategoryClick) {
  console.log(categories);
  console.log(locale);
  return (
    <>
      <li id="category" value="all" onClick={() => handleCategoryClick(null)}>
        {locale === "pt" ? "Todos os produtos" : "All products"}
      </li>
      {categories.map((category, index) => (
        <li
          key={index}
          value={locale === "pt" ? category.nome : category.nameEng}
          id={locale === "pt" ? category.nome : category.nameEng}
          onClick={() => handleCategoryClick(category)}
        >
          {locale === "pt"
            ? category.nome.charAt(0).toUpperCase() + category.nome.slice(1)
            : category.nameEng.charAt(0).toUpperCase() + category.nameEng.slice(1)}
        </li>
      ))}
    </>
  );
}