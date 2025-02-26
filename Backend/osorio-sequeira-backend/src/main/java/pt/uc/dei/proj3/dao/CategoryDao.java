package pt.uc.dei.proj3.dao;

import jakarta.ejb.Stateless;
import pt.uc.dei.proj3.entity.CategoryEntity;

@Stateless
public class CategoryDao extends AbstractDao<CategoryEntity>{
    private static final long serialVersionUID = 1L;

    public CategoryDao() {
        super(CategoryEntity.class);
    }







}
