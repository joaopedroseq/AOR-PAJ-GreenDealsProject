package pt.uc.dei.proj3.beans;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dto.CategoryDto;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.entity.CategoryEntity;
import pt.uc.dei.proj3.entity.ProductEntity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Stateless
public class CategoryBean implements Serializable {
    private static final Logger logger = LogManager.getLogger(UserBean.class);
    @Inject
    ApplicationBean applicationBean;

    @Inject
    UserBean userBean;

    @EJB
    CategoryDao categoryDao;

    public CategoryBean() {
    }

    public boolean registerNewCategory(CategoryDto category) {
        if(checkIfCategoryAlreadyExists(category)) {
            return false;
        }
        else{
            categoryDao.persist(convertCategoryDtoToCategoryEntity(category));
            return true;
        }
    }

    private boolean checkIfCategoryAlreadyExists(CategoryDto category) {
        List<CategoryEntity> categoryEntities = categoryDao.getAllCategories();
        for(CategoryEntity categoryEntity : categoryEntities) {
            if(categoryEntity.getNome().equals(category.getName())){
                return true;
            }
        }
        return false;

    }


    //Converters
    private Set<CategoryDto> convertGroupCategoryEntityToGroupCategoryDto(Set<CategoryEntity> categories) {
        Set<CategoryDto> categoryDtos = new HashSet<>();
        for (CategoryEntity categoryEntity : categories) {
            CategoryDto categoryDto = convertCategoryEntityToCategoryDto(categoryEntity);
            categoryDtos.add(categoryDto);
        }
        return categoryDtos;
    }

    private CategoryDto convertCategoryEntityToCategoryDto(CategoryEntity categoryEntity) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setName(categoryEntity.getNome());
        return categoryDto;
    }

    private CategoryEntity convertCategoryDtoToCategoryEntity(CategoryDto categoryDto) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setNome(categoryDto.getName());
        return categoryEntity;
    }
}
