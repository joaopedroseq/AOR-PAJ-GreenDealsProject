import React from "react";
import './aside.css';
import useProductStore from '../../stores/useProductStore';
import { useCategoriesStore } from "../../stores/useCategoriesStore";



const Aside = ({
    isAsideVisible,
}) => {
    //Categories from the useCategoriesStore
    const categories = useCategoriesStore((state) => state.categories);
    console.log(categories);
      

    //Filtering products
    const { setFilters } = useProductStore();
    const handleCategoryClick = (category) => {
        setFilters({ category });
    };


    return (
        <aside
        id="aside-menu"
        style={{ display: isAsideVisible ? "block" : "none" }}>
            <ul>
                <h3>Categorias</h3>
                <li id="category" value="all">Todos os produtos</li>
                {categories.map((category, index) => (
                  <li key={index} value={category} id={category}>
                    {category}
                  </li>
                ))}
            </ul>
        </aside>
    )
};
export default Aside;