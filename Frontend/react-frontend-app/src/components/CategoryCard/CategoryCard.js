import excludeIcon from "../../Assets/icons/exclude.png";

const CategoryCard = ({ category, onDelete, locale }) => {
  const numberOfProducts = category.products;
  const categoryName = locale === "pt" ? category.nome : category.nameEng;

  return (
    <div className="category-card">
      <div className="category-info">
        <p className="category-name">{categoryName}</p>
        <p className="category-numberOfProducts">
          {locale === "pt" ? 'Número de produtos: ' : 'Number of products: '}{numberOfProducts}
        </p>
        <img
          src={excludeIcon}
          alt="exclude category"
          className="remove-category-button"
          onClick={onDelete}
          data-category-numberofproducts={numberOfProducts}
          data-category-name={categoryName}
        />
      </div>
    </div>
  );
};

export default CategoryCard;