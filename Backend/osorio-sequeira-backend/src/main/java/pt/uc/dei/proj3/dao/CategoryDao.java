package pt.uc.dei.proj3.dao;

import jakarta.ejb.Stateless;
import pt.uc.dei.proj3.entity.CategoryEntity;
import pt.uc.dei.proj3.entity.ProductEntity;

@Stateless
public class CategoryDao extends AbstractDao<CategoryEntity>{
    private static final long serialVersionUID = 1L;

    public CategoryDao(Class<CategoryEntity> clazz) {
        super(CategoryEntity.class);
    }



}
