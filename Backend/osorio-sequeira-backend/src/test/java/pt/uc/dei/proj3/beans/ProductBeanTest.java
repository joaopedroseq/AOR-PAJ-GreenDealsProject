package pt.uc.dei.proj3.beans;


import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import pt.uc.dei.proj3.dao.ProductDao;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.StateId;
import pt.uc.dei.proj3.entity.CategoryEntity;
import pt.uc.dei.proj3.entity.ProductEntity;
import pt.uc.dei.proj3.entity.UserEntity;

import java.time.LocalDateTime;
import java.util.HashSet;

public class ProductBeanTest {

    @Mock
    private ProductBean productBean;

    @Mock
    private ProductDao productDao;

    @Mock
    private ProductEntity productEntity;

    @Mock
    private UserEntity userEntity;

    @Mock
    private CategoryEntity categoryEntity;  // Not mocked, will use real instance

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        CategoryEntity categoryEntity1 = new CategoryEntity();
        categoryEntity1.setNome("tecnologia");
        UserEntity userEntity1 = getUserEntity1();
        ProductEntity productEntity1 = getProductEntity1(userEntity1, categoryEntity1);

        CategoryEntity categoryEntity2 = new CategoryEntity();
        categoryEntity2.setNome("ferramentas");
        UserEntity userEntity2 = getUserEntity2();
        ProductEntity productEntity2 = getProductEntity2(userEntity2, categoryEntity2);

        when(productDao.getProductById(111)).thenReturn(productEntity1);
        when(productDao.getProductById(222)).thenReturn(productEntity2);


        productBean = new ProductBean(productDao);
        userEntity = mock(UserEntity.class);
        categoryEntity = mock(CategoryEntity.class);
        productEntity = mock(ProductEntity.class);

        when(productEntity.getId()).thenReturn(111);
        when(productEntity.getDescription()).thenReturn("A 55-inch LED TV");
        when(productEntity.getPrice()).thenReturn(499.99);
        when(productEntity.getName()).thenReturn("TV");
        when(productEntity.getDate()).thenReturn(LocalDateTime.of(2023, 3, 5, 10, 0, 0));
        when(productEntity.getLocation()).thenReturn("Aisle 3, Section B");
        when(productEntity.getSeller()).thenReturn(userEntity);
        when(productEntity.getCategory()).thenReturn(categoryEntity);
        when(productEntity.getUrlImage()).thenReturn("http://example.com/tv.jpg");
        when(productEntity.getState()).thenReturn(1);
        when(productEntity.getExcluded()).thenReturn(false);

        when(userEntity.getUsername()).thenReturn("Best Seller");
        when(categoryEntity.getNome()).thenReturn("tecnologia");


    }

    @Test
    void testFindProductById_Success() {
        int idProduct1 = 111;
        int idProduct2 = 222;

        // Expected ProductDto for the products
        ProductDto productDto1 = getProductDto1();
        ProductDto productDto2 = getProductDto2();

        // Assertions to verify the correct productDto is returned
        assertAll(
                () -> assertEquals(productDto1.getDate(), productBean.findProductById(idProduct1).getDate()),
                () -> assertEquals(productDto1.getUrlImage(), productBean.findProductById(idProduct1).getUrlImage()),
                () -> assertEquals(productDto2.getDescription(), productBean.findProductById(idProduct2).getDescription()),
                () -> assertEquals(productDto2.getSeller(), productBean.findProductById(idProduct2).getSeller()),
                () -> assertEquals(productDto2.getState(), productBean.findProductById(idProduct2).getState())
        );
    }




@Test
void testConvertSingleProductEntitytoProductDto() {
    // Call the method being tested
    ProductDto result = productBean.convertSingleProductEntitytoProductDto(productEntity);

    // Expected ProductDto
    ProductDto expectedProductDto = new ProductDto();
    expectedProductDto.setId(111);
    expectedProductDto.setDescription("A 55-inch LED TV");
    expectedProductDto.setPrice(499.99);
    expectedProductDto.setName("TV");
    expectedProductDto.setDate(LocalDateTime.of(2023, 3, 5, 10, 0, 0));
    expectedProductDto.setLocation("Aisle 3, Section B");
    expectedProductDto.setState(StateId.RASCUNHO.stateIdFromInt(1)); // Map state from 1
    expectedProductDto.setSeller("Best Seller");
    expectedProductDto.setCategory("tecnologia");
    expectedProductDto.setUrlImage("http://example.com/tv.jpg");
    expectedProductDto.setExcluded(false);

    // Assertions to verify that the result is as expected
    assertEquals(expectedProductDto, result);
}




    private static UserEntity getUserEntity1() {
        UserEntity userEntity1 = new UserEntity();
        userEntity1.setFirstName("John");
        userEntity1.setLastName("Doe");
        userEntity1.setEmail("john@doe.com");
        userEntity1.setPhoneNumber("123456789");
        userEntity1.setUsername("johndoe");
        userEntity1.setPassword("password");
        userEntity1.setUrl("https://www.photo.com");
        userEntity1.setExcluded(false);
        userEntity1.setAdmin(true);
        userEntity1.setProducts(new HashSet<>());
        userEntity1.setEvaluationsReceived(new HashSet<>());
        userEntity1.setEvaluationsWritten(new HashSet<>());
        return userEntity1;
    }
    private static UserEntity getUserEntity2() {
        UserEntity userEntity2 = new UserEntity();
        userEntity2.setFirstName("Jane");
        userEntity2.setLastName("Smith");
        userEntity2.setEmail("jane@smith.com");
        userEntity2.setPhoneNumber("987654321");
        userEntity2.setUsername("janesmith");
        userEntity2.setPassword("securepassword");
        userEntity2.setUrl("https://www.janesphoto.com");
        userEntity2.setExcluded(true);  // Different from userEntity1
        userEntity2.setAdmin(false);    // Different from userEntity1
        userEntity2.setProducts(new HashSet<>());
        userEntity2.setEvaluationsReceived(new HashSet<>());
        userEntity2.setEvaluationsWritten(new HashSet<>());
        return userEntity2;
    }
    private static ProductEntity getProductEntity1(UserEntity userEntity, CategoryEntity categoryEntity) {
        ProductEntity product1 = new ProductEntity();
        product1.setSeller(userEntity);
        product1.setId(111);
        product1.setName("TV");
        product1.setDescription("A 55-inch LED TV");
        product1.setPrice(499.99);
        product1.setCategory(categoryEntity);
        product1.setLocation("porto");
        product1.setUrlImage("http://example.com/tv.jpg");
        product1.setState(2);
        product1.setDate(LocalDateTime.of(2023, 3, 5, 10, 0, 0, 0));
        product1.setExcluded(false);
        product1.setEditedDate(product1.getDate());
        return product1;
    }
    private static ProductEntity getProductEntity2(UserEntity userEntity, CategoryEntity categoryEntity) {
        ProductEntity product2 = new ProductEntity();
        product2.setSeller(userEntity);
        product2.setId(222);
        product2.setName("Alicate");
        product2.setDescription("A useful hand tool for gripping");
        product2.setPrice(19.99);
        product2.setCategory(categoryEntity);
        product2.setLocation("porto");
        product2.setUrlImage("http://example.com/alicate.jpg");
        product2.setState(1);
        product2.setDate(LocalDateTime.of(2023, 3, 5, 10, 0, 0, 0));
        product2.setExcluded(true);
        product2.setEditedDate(product2.getDate());
        return product2;
    }
    private static ProductDto getProductDto1() {
        ProductDto productDto1 = new ProductDto();
        productDto1.setId(111);
        productDto1.setSeller("johndoe");
        productDto1.setName("TV");
        productDto1.setDescription("A 55-inch LED TV");
        productDto1.setPrice(499.99);
        productDto1.setCategory("tecnologia");
        productDto1.setLocation("porto");
        productDto1.setUrlImage("http://example.com/tv.jpg");
        productDto1.setState(StateId.DISPONIVEL);
        productDto1.setDate(LocalDateTime.of(2023, 3, 5, 10, 0, 0, 0));
        productDto1.setExcluded(false);
        productDto1.setEdited(productDto1.getDate());
        return productDto1;
    }
    private static ProductDto getProductDto2() {
        ProductDto productDto2 = new ProductDto();
        productDto2.setId(222);
        productDto2.setSeller("janesmith");
        productDto2.setName("Alicate");
        productDto2.setDescription("A useful hand tool for gripping");
        productDto2.setPrice(19.99);
        productDto2.setCategory("ferramentas");
        productDto2.setLocation("porto");
        productDto2.setUrlImage("http://example.com/alicate.jpg");
        productDto2.setState(StateId.RASCUNHO);
        productDto2.setDate(LocalDateTime.of(2023, 3, 5, 10, 0, 0, 0));
        productDto2.setExcluded(false);
        productDto2.setEdited(productDto2.getDate());
        return productDto2;
    }
}


/*
    @Test
    void testFindProductById_Exception() {
        // Preparation: product ID
        int productId = 1;

        // Mocking the method call to throw an exception
        when(productDao.getProductById(productId)).thenThrow(new RuntimeException());

        // Test the method
        ProductDto result = productService.findProductById(productId);

        // Assert the result
        assertNull(result);
    }



 */

