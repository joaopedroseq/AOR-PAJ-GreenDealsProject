package pt.uc.dei.proj3.beans;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pt.uc.dei.proj4.beans.CategoryBean;
import pt.uc.dei.proj4.dao.CategoryDao;
import pt.uc.dei.proj4.dao.ProductDao;
import pt.uc.dei.proj4.dto.CategoryDto;
import pt.uc.dei.proj4.entity.CategoryEntity;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryBeanTest {

    CategoryBean categoryBean;
    CategoryDao categoryDao;
    ProductDao productDao;
    ArrayList<CategoryEntity> categoryList;

    @BeforeEach
    void setup() {
        // creates the mock objects
        categoryDao = mock(CategoryDao.class);
        productDao = mock(ProductDao.class);
        // the class under test
        categoryBean = new CategoryBean(productDao, categoryDao);
        // Preparation: create categories
        CategoryEntity category1 = new CategoryEntity();
        category1.setNome("tecnologia");
        CategoryEntity category2 = new CategoryEntity();
        category2.setNome("ferramentas");
        CategoryEntity category3 = new CategoryEntity();
        category3.setNome("vestuario");
        CategoryEntity categoryEmpty = new CategoryEntity();
        categoryEmpty.setNome("empty");
        categoryList = new ArrayList<>();
        categoryList.add(category1);
        categoryList.add(category2);
        categoryList.add(category3);

        when(categoryDao.findCategoryByName("tecnologia")).thenReturn(category1);
        when(categoryDao.findCategoryByName("ferramentas")).thenReturn(category2);
        when(categoryDao.findCategoryByName("vestuario")).thenReturn(category3);
        when(categoryDao.findCategoryByName("empty")).thenReturn(categoryEmpty);
        when(categoryDao.getAllCategories()).thenReturn(categoryList);
    }

    @Test
    void testfindCategoryByNameSUCCESS() {
        CategoryDto categoryDto1 = new CategoryDto();
        categoryDto1.setName("tecnologia");
        CategoryDto categoryDto2 = new CategoryDto();
        categoryDto2.setName("vestuario");

        assertAll(
                () -> assertTrue(categoryBean.checkIfCategoryExists(categoryDto1)),
                () -> assertTrue(categoryBean.checkIfCategoryExists(categoryDto2))
        );
    }

    @Test
    void testfindCategoryByNameFAIL() {
        CategoryDto categoryDto1 = new CategoryDto();
        categoryDto1.setName("Tecnologia");
        CategoryDto categoryDto2 = new CategoryDto();
        categoryDto2.setName("arrumacao");
        assertAll(
                () -> assertFalse(categoryBean.checkIfCategoryExists(categoryDto1)),
                () -> assertFalse(categoryBean.checkIfCategoryExists(categoryDto2))
        );
        verify(categoryDao, never()).persist(any(CategoryEntity.class));
    }

    @Test
    void testRegisterNewCategorySUCCESS() {
        CategoryDto categoryDto1 = new CategoryDto();
        categoryDto1.setName("tecnologias");
        CategoryDto categoryDto2 = new CategoryDto();
        categoryDto2.setName("calcado");

        assertTrue(categoryBean.registerNewCategory(categoryDto1));
        verify(categoryDao, times(1)).persist(any(CategoryEntity.class));  // Verify first call
        assertTrue(categoryBean.registerNewCategory(categoryDto2));
        verify(categoryDao, times(2)).persist(any(CategoryEntity.class));  // Verify second call
    }

    @Test
    void testRegisterNewCategoryFAIL() {
        CategoryDto categoryDto1 = new CategoryDto();
        categoryDto1.setName("Tecnologia");
        CategoryDto categoryDto2 = new CategoryDto();
        categoryDto2.setName("tecnologia");
        CategoryDto categoryDto3 = new CategoryDto();
        categoryDto3.setName("VeStUaRiO");

        assertAll(
                () -> categoryBean.registerNewCategory(categoryDto1),
                () -> categoryBean.registerNewCategory(categoryDto2),
                () -> categoryBean.registerNewCategory(categoryDto3)
        );
        verify(categoryDao, never()).persist(any(CategoryEntity.class));
    }

    @Test
    void testDeleteCategory() {
        CategoryDto categoryDto1 = new CategoryDto();
        categoryDto1.setName("tecnologia");

        CategoryDto categoryDto2 = new CategoryDto();
        categoryDto2.setName("calcado");

        // Setting up the mock to return the new category entity
        CategoryEntity calcadoCategory = new CategoryEntity();
        calcadoCategory.setNome("calcado");
        when(categoryDao.findCategoryByName("calcado")).thenReturn(calcadoCategory);

        assertTrue(categoryBean.deleteCategory(categoryDto1));
        verify(categoryDao, times(1)).findCategoryByName("empty");
        verify(productDao, times(1)).setAllProductsCategoryToEmpty(any(CategoryEntity.class), any(CategoryEntity.class));
        verify(categoryDao, times(1)).deleteCategory(any(CategoryEntity.class));

        assertTrue(categoryBean.deleteCategory(categoryDto2));
        verify(categoryDao, times(2)).findCategoryByName("empty");
        verify(productDao, times(2)).setAllProductsCategoryToEmpty(any(CategoryEntity.class), any(CategoryEntity.class));
        verify(categoryDao, times(2)).deleteCategory(any(CategoryEntity.class));
    }

}