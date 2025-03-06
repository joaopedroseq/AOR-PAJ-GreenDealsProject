package pt.uc.dei.proj3.service;

import jakarta.ws.rs.core.Response;
import org.junit.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import pt.uc.dei.proj3.beans.CategoryBean;
import pt.uc.dei.proj3.beans.UserBean;
import pt.uc.dei.proj3.dto.CategoryDto;
import pt.uc.dei.proj3.dto.LoginDto;
import pt.uc.dei.proj3.dto.UserDto;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
class CategoryServiceTest {

    @Mock
    CategoryBean categoryBean;
    @Mock
    UserBean userBean;

    UserDto adminUser;
    UserDto regularUser;
    LoginDto loginDtoAdmin;
    LoginDto loginDtoREgular;
    CategoryDto validCategory;
    CategoryDto invalidCategory;

    @InjectMocks
    private CategoryService categoryService;


    @BeforeEach
    public void setUp() {
        // Preparation
        MockitoAnnotations.openMocks(this);
        // Mock UserBean and CategoryBean behaviors
        when(userBean.verifyToken("validToken")).thenReturn(adminUser);
        when(categoryBean.registerNewCategory(validCategory)).thenReturn(true);

        //Admin
        adminUser = new UserDto();
        adminUser.setAdmin(true);
        adminUser.setUsername("admin");
        adminUser.setPassword("admin");
        loginDtoAdmin = new LoginDto();
        loginDtoAdmin.setUsername("admin");
        loginDtoAdmin.setPassword("admin");
        when(userBean.login(loginDtoAdmin)).thenReturn("tokenAdmin");
        when(userBean.login(loginDtoAdmin)).thenReturn("tokenRegular");



        //Non-Admin
        regularUser = new UserDto();
        regularUser.setAdmin(false);
        regularUser.setUsername("regular");
        regularUser.setPassword("regular");
        loginDtoREgular = new LoginDto();
        loginDtoREgular.setUsername("regular");
        loginDtoREgular.setPassword("regular");

        //Categories
        validCategory = new CategoryDto();
        validCategory.setName("Categoria A");
        invalidCategory = new CategoryDto();
        invalidCategory.setName("");
    }

    @Test
    void registerNewCategorySuccess() {
        Response response = categoryService.registerNewCategory("validToken", validCategory);
        assertEquals(200, response.getStatus(), "Expected status code 200 but found " + response.getStatus());
    }

    @Test
    void deleteCategory() {
    }

    @Test
    void getAllCategories() {
    }
}