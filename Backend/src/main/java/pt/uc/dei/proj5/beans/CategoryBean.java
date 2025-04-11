package pt.uc.dei.proj5.beans;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dao.CategoryDao;
import pt.uc.dei.proj5.dao.ProductDao;
import pt.uc.dei.proj5.dto.CategoryDto;
import pt.uc.dei.proj5.dto.Language;
import pt.uc.dei.proj5.dto.ProductDto;
import pt.uc.dei.proj5.dto.ProductStateId;
import pt.uc.dei.proj5.entity.CategoryEntity;
import pt.uc.dei.proj5.entity.ProductEntity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Stateless
public class CategoryBean implements Serializable {
    private static final Logger logger = LogManager.getLogger(CategoryBean.class);


    @Inject
    UserBean userBean;

    @Inject
    ProductDao productDao;

    @EJB
    CategoryDao categoryDao;

    public CategoryBean() {
    }

    public CategoryBean(ProductDao productDao, CategoryDao categoryDao) {
        this.productDao = productDao;
        this.categoryDao = categoryDao;
    }

    public boolean registerNewCategory(CategoryDto category) {
        category.setNome(category.getNome().toLowerCase());
        category.setNameEng(category.getNameEng().toLowerCase());
        if(checkIfCategoryExists(category)) {
            return false;
        }
        else{
            categoryDao.persist(convertCategoryDtoToCategoryEntity(category));
            return true;
        }
    }

    public boolean deleteCategory(CategoryDto category) {
        try {
            CategoryEntity empty;
            if(!categoryDao.findIfCategoryEmptyExists()){
                empty = createEmptyCategory();
            }
            else {
                empty = categoryDao.findCategoryByName("sem categoria");
            }
            CategoryEntity categoryEntity = convertCategoryDtoToCategoryEntity(category);
            productDao.setAllProductsCategoryToEmpty(empty, categoryEntity);
            if(categoryDao.deleteCategory(categoryEntity)){
                return true;
            }
            else{
                return false;
            }
        } catch (Exception e) {
            logger.error("Error deleting category {} in CategoryBean.deleteCategory", category.getNome());
            return false;
        }
    }

    public boolean checkIfCategoryExists(CategoryDto category) {
        List<CategoryEntity> categoryEntities = categoryDao.getAllCategories(Language.PT);
        for(CategoryEntity categoryEntity : categoryEntities) {
            if(!categoryEntity.getNome().equals(category.getNome())){
                return false;
            }
        }
        categoryEntities = categoryDao.getAllCategories(Language.EN);
        for(CategoryEntity categoryEntity : categoryEntities) {
            if(!categoryEntity.getNome().equals(category.getNome())){
                return false;
            }
        }
        return true;
    }

    private CategoryEntity createEmptyCategory() {
        CategoryEntity empty;
        empty = new CategoryEntity();
        empty.setNome("sem categoria");
        empty.setNameEng("empty");
        categoryDao.persist(empty);
        categoryDao.flush();
        return empty;
    }

    public CategoryDto getCategoryDto(String category) {
        try {
            CategoryEntity categoryEntity = categoryDao.findCategoryByName(category);
            return convertCategoryEntityToCategoryDto(categoryEntity);
        } catch (Exception e) {
            logger.error("Error while category" + category);
            logger.error(e);
            return null;
        }
    }


    //Converters
    private List<CategoryDto> convertGroupCategoryEntityToGroupCategoryDto(List<CategoryEntity> categories) {
        ArrayList<CategoryDto> categoryDtos = new ArrayList<>();
        for (CategoryEntity categoryEntity : categories) {
            CategoryDto categoryDto = convertCategoryEntityToCategoryDto(categoryEntity);
            categoryDtos.add(categoryDto);
        }
        return categoryDtos;
    }

    public CategoryDto convertCategoryEntityToCategoryDto(CategoryEntity categoryEntity) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setNome(categoryEntity.getNome());
        categoryDto.setNameEng(categoryEntity.getNameEng());
        return categoryDto;
    }

    public CategoryEntity convertCategoryDtoToCategoryEntity(CategoryDto categoryDto) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setNome(categoryDto.getNome());
        categoryEntity.setNameEng(categoryDto.getNameEng());
        return categoryEntity;
    }


    public List<CategoryDto> getAllCategories(Language language) {
        try {
            List<CategoryEntity> categories = categoryDao.getAllCategories(language);
            return convertGroupCategoryEntityToGroupCategoryDto(categories);
        } catch (Exception e) {
            logger.error("Error while getting all categories");
            logger.error(e);
            return null;
        }
    }
}
