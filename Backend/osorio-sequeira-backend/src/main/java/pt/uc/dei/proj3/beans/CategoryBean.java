package pt.uc.dei.proj3.beans;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dao.ProductDao;
import pt.uc.dei.proj3.dto.CategoryDto;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.StateId;
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
        category.setName(category.getName().toLowerCase());
        if(checkIfCategoryAlreadyExists(category)) {
            return false;
        }
        else{
            categoryDao.persist(convertCategoryDtoToCategoryEntity(category));
            return true;
        }
    }

    public boolean deleteCategory(CategoryDto category) {
        try {
            CategoryEntity empty = categoryDao.findCategoryByName("empty");
            CategoryEntity categoryEntity = convertCategoryDtoToCategoryEntity(category);
            productDao.setAllProductsCategoryToEmpty(empty, categoryEntity);
            categoryDao.deleteCategory(categoryEntity);
            return true;
        } catch (Exception e) {
            logger.error("Error deleting category {} in CategoryBean.deleteCategory", category.getName());
            return false;
        }
    }

    public boolean checkIfCategoryAlreadyExists(CategoryDto category) {
        List<CategoryEntity> categoryEntities = categoryDao.getAllCategories();
        for(CategoryEntity categoryEntity : categoryEntities) {
            if(categoryEntity.getNome().equals(category.getName())){
                return true;
            }
        }
        return false;
    }

    public Set<ProductDto> getProductsByCategory(String category) {
        try {
            List<ProductEntity> products = productDao.getProductsByCategory(category);
            Set<ProductEntity> productSet = new HashSet<>(products);
            return convertGroupProductEntityToGroupProductDto(productSet);
        } catch (Exception e) {
            logger.error("Error while getting active products");
            logger.error(e);
            return null;
        }
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
        categoryDto.setProducts(userBean.convertGroupProductEntityToGroupProductDto(categoryEntity.getProduct()));
        return categoryDto;
    }

    private CategoryEntity convertCategoryDtoToCategoryEntity(CategoryDto categoryDto) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setNome(categoryDto.getName());
        return categoryEntity;
    }

    public Set<ProductDto> convertGroupProductEntityToGroupProductDto(Set<ProductEntity> products) {
        Set<ProductDto> productDtos = new HashSet<>();
        for (ProductEntity productEntity : products) {
            ProductDto produto = convertSingleProductEntitytoProductDto(productEntity);
            productDtos.add(produto);
        }
        return productDtos;
    }

    public ProductDto convertSingleProductEntitytoProductDto(ProductEntity productEntity) {
        ProductDto produto = new ProductDto();
        produto.setId(productEntity.getId());
        produto.setDescription(productEntity.getDescription());
        produto.setPrice(productEntity.getPrice());
        produto.setName(productEntity.getName());
        produto.setDate(productEntity.getDate());
        produto.setLocation(productEntity.getLocation());
        StateId state = StateId.RASCUNHO;
        produto.setState(state.stateIdFromInt(productEntity.getState()));
        produto.setSeller(productEntity.getSeller().getUsername());
        produto.setCategory(productEntity.getCategory().getNome());
        produto.setUrlImage(productEntity.getUrlImage());
        produto.setEdited(productEntity.getEditedDate());
        produto.setExcluded(productEntity.getExcluded());
        return produto;
    }

    public Set<CategoryDto> getAllCategories() {
        try {
            List<CategoryEntity> categories = categoryDao.getAllCategories();
            Set<CategoryEntity> catedorySet = new HashSet<>(categories);
            return convertGroupCategoryEntityToGroupCategoryDto(catedorySet);
        } catch (Exception e) {
            logger.error("Error while getting all categories");
            logger.error(e);
            return null;
        }
    }
}
