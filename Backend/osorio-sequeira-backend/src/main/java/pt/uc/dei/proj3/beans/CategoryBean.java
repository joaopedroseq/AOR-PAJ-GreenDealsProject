package pt.uc.dei.proj3.beans;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dto.CategoryDto;
import pt.uc.dei.proj3.entity.CategoryEntity;

import java.io.Serializable;

@Stateless
public class CategoryBean implements Serializable {
    private static final Logger logger = LogManager.getLogger(UserBean.class);
    @Inject
    ApplicationBean applicationBean;

    @EJB
    CategoryDao categoryDao;

    public CategoryBean() {
    }

    public boolean registerNewCategory(CategoryDto category) {
        if(categoryDao.getAllCategories().contains(category)) {
            return false;
        }
        else{
            categoryDao.persist(convertCategoryDtoToCategoryEntity(category));
            return true;
        }
    }

    //Converters
    private CategoryEntity convertCategoryDtoToCategoryEntity(CategoryDto categoryDto) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setNome(categoryDto.getName());
        return categoryEntity;
    }
}
