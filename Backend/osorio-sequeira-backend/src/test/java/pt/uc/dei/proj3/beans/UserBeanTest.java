package pt.uc.dei.proj3.beans;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import at.favre.lib.crypto.bcrypt.BCrypt;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dao.ProductDao;
import pt.uc.dei.proj3.dao.UserDao;
import pt.uc.dei.proj3.dto.LoginDto;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.StateId;
import pt.uc.dei.proj3.dto.UserDto;
import pt.uc.dei.proj3.entity.CategoryEntity;
import pt.uc.dei.proj3.entity.ProductEntity;
import pt.uc.dei.proj3.entity.UserEntity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class UserBeanTest {

    @InjectMocks
    private UserBean userBean;

    @Mock
    private UserDao userDao;

    @Mock
    private CategoryDao categoryDao;

    @Mock
    private ProductDao productDao;

    @Mock
    private ProductBean productBean;

    @Mock
    private UserEntity userEntity;

    @Mock
    private UserDto userDto;

    @Mock
    private LoginDto loginDto;

    @Mock
    private ProductDto productDto;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        userEntity = getUserEntity1();
        userDto =  getUserDto1();
        productDto = getProductDto1();
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
    private static UserDto getUserDto1() {
        UserDto userDto1 = new UserDto();
        userDto1.setFirstName("John");
        userDto1.setLastName("Doe");
        userDto1.setEmail("john@doe.com");
        userDto1.setPhoneNumber("123456789");
        userDto1.setUsername("johndoe");
        userDto1.setPassword("password");
        userDto1.setUrl("https://www.photo.com");
        userDto1.setExcluded(false);
        userDto1.setAdmin(true);
        userDto1.setProducts(new HashSet<>());
        userDto1.setEvaluationsReceived(new HashSet<>());
        return userDto1;
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

    // Test for registerNormalUser method
    @Test
    void testRegisterNormalUser_UserNotExists() {
        // Arrange
        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(null); // No user found

        // Act
        boolean result = userBean.registerNormalUser(userDto);

        // Assert
        assertTrue(result);
        verify(userDao, times(1)).persist(any(UserEntity.class)); // Ensure persist is called once
    }

    @Test
    void testRegisterNormalUser_UserAlreadyExists() {
        // Arrange
        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(userEntity); // User exists

        // Act
        boolean result = userBean.registerNormalUser(userDto);

        // Assert
        assertFalse(result);
        verify(userDao, never()).persist(any(UserEntity.class)); // Ensure persist is never called
    }

    // Test for registerAdmin method
    @Test
    void testRegisterAdmin_UserNotExists() {
        // Arrange
        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(null); // No user found

        // Act
        boolean result = userBean.registerAdmin(userDto);

        // Assert
        assertTrue(result);
        verify(userDao, times(1)).persist(any(UserEntity.class)); // Ensure persist is called once
    }

    @Test
    void testRegisterAdmin_UserAlreadyExists() {
        // Arrange
        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(userEntity); // User exists

        // Act
        boolean result = userBean.registerAdmin(userDto);

        // Assert
        assertFalse(result);
        verify(userDao, never()).persist(any(UserEntity.class)); // Ensure persist is never called
    }

    //Erro ao fazer mock da classe BCrypt
    /*
        @Test
        void testLogin_SuccessfulLogin() {
            // Arrange
            String username = "username";
            String password = "password";  // Password that the user will use to log in
            String hashedPassword = "$2a$06$If6bvum7DFjUnE9p2uDeDu0YHzrHM6tf.iqN8.yx.jNN1ILEf7h0i";  // Example of a hashed password using BCrypt

            // Mock LoginDto to return the correct username and password
            when(loginDto.getUsername()).thenReturn(username);
            when(loginDto.getPassword()).thenReturn(password);

            // Mock UserEntity to return the correct hashed password
            when(userDao.findUserByUsername(username)).thenReturn(userEntity);
            when(userEntity.getPassword()).thenReturn(hashedPassword);

            when(BCrypt.verifyer().verify(loginDto.getPassword().toCharArray(), userEntity.getPassword()).verified).thenReturn(true);


            // Act
            String token = userBean.login(loginDto);

            // Assert
            assertNotNull(token);  // Ensure that a token is returned
            verify(userDao, times(1)).findUserByUsername(username);  // Ensure findUserByUsername was called
            verify(userEntity, times(1)).setToken(anyString());  // Ensure setToken was called
        }

        @Test
        void testLogin_FailedLogin() {
            // Arrange
            loginDto = new LoginDto();
            loginDto.setUsername("username");
            loginDto.setPassword("password");
            when(userDao.findUserByUsername(loginDto.getUsername())).thenReturn(userEntity); // User exists
            when(userEntity.getPassword()).thenReturn("$2a$10$..."); // Example hashed password
            when(BCrypt.verifyer().verify(loginDto.getPassword().toCharArray(), userEntity.getPassword()).verified).thenReturn(false);

            // Act
            String token = userBean.login(loginDto);

            // Assert
            assertNull(token); // Ensure null is returned for failed login
            verify(userDao, times(1)).findUserByUsername(loginDto.getUsername()); // Ensure findUserByUsername was called
            verify(userEntity, never()).setToken(anyString()); // Ensure setToken was not called
        }

*/

    @Test
    void testLogout_SuccessfulLogout() {
        // Arrange
        String token = "validToken";
        UserEntity userEntity = new UserEntity();  // Mock UserEntity
        userEntity.setToken(token);

        // Mock userDao to return a user for the provided token
        when(userDao.findUserByToken(token)).thenReturn(userEntity);

        // Act
        boolean result = userBean.logout(token);

        // Assert
        assertTrue(result);  // The result should be true because the token is valid
        assertNull(userEntity.getToken());  // The token should be set to null after logout
        verify(userDao, times(1)).findUserByToken(token);  // Verify that userDao.findUserByToken() was called
    }

    @Test
    void testLogout_UserNotFound() {
        // Arrange
        String token = "invalidToken";

        // Mock userDao to return null (user not found for the token)
        when(userDao.findUserByToken(token)).thenReturn(null);

        // Act
        boolean result = userBean.logout(token);

        // Assert
        assertFalse(result);  // The result should be false because no user was found for the token
        verify(userDao, times(1)).findUserByToken(token);  // Verify that userDao.findUserByToken() was called
    }

    //Erro ao tentar fazer mock de métod privado
    /*
    @Test
    void testVerifyToken_Success() {
        // Arrange
        String token = "validToken";
        UserEntity userEntity = getUserEntity1();
        UserDto expectedUserDto = getUserDto1();

        // Mock userDao to return a user for the provided token
        when(userDao.findUserByToken(token)).thenReturn(userEntity);

        // Mock the conversion method
        when(userBean.convertUserEntitytoUserDto(userEntity)).thenReturn(expectedUserDto);

        // Act
        UserDto result = userBean.verifyToken(token);

        // Assert
        assertEquals(expectedUserDto, result);  // Ensure the converted UserDto is returned
        verify(userDao, times(1)).findUserByToken(token);  // Verify that userDao.findUserByToken() was called
    }
*/

    @Test
    void testVerifyToken_UserNotFound() {
        // Arrange
        String token = "invalidToken";

        // Mock userDao to return null (user not found for the token)
        when(userDao.findUserByToken(token)).thenReturn(null);

        // Act
        UserDto result = userBean.verifyToken(token);

        // Assert
        assertNull(result);  // Ensure null is returned if no user is found
        verify(userDao, times(1)).findUserByToken(token);  // Verify that userDao.findUserByToken() was called
    }

    @Test
    void testCheckIfTokenValid_TokenExists() {
        // Arrange
        String token = "validToken";

        // Mock userDao to return true (token exists)
        when(userDao.findIfTokenExists(token)).thenReturn(true);

        // Act
        boolean result = userBean.checkIfTokenValid(token);

        // Assert
        assertTrue(result);  // Ensure the result is true because the token exists
        verify(userDao, times(1)).findIfTokenExists(token);  // Verify that userDao.findIfTokenExists() was called
    }

    @Test
    void testCheckIfTokenValid_TokenDoesNotExist() {
        // Arrange
        String token = "invalidToken";

        // Mock userDao to return false (token does not exist)
        when(userDao.findIfTokenExists(token)).thenReturn(false);

        // Act
        boolean result = userBean.checkIfTokenValid(token);

        // Assert
        assertFalse(result);  // Ensure the result is false because the token does not exist
        verify(userDao, times(1)).findIfTokenExists(token);  // Verify that userDao.findIfTokenExists() was called
    }

    @Test
    void testCheckIfUserExists_UserExists() {
        // Arrange
        String username = "testUser";

        // Mock userDao to return true (user exists)
        when(userDao.findIfUserExists(username)).thenReturn(true);

        // Act
        boolean result = userBean.checkIfUserExists(username);

        // Assert
        assertTrue(result);  // Ensure the result is true because the user exists
        verify(userDao, times(1)).findIfUserExists(username);  // Verify that userDao.findIfUserExists() was called
    }

    @Test
    void testCheckIfUserExists_UserDoesNotExist() {
        // Arrange
        String username = "nonExistentUser";

        // Mock userDao to return false (user does not exist)
        when(userDao.findIfUserExists(username)).thenReturn(false);

        // Act
        boolean result = userBean.checkIfUserExists(username);

        // Assert
        assertFalse(result);  // Ensure the result is false because the user does not exist
        verify(userDao, times(1)).findIfUserExists(username);  // Verify that userDao.findIfUserExists() was called
    }

    @Test
    void testUpdateUser_Success() {
        // Arrange
        when(userDao.findUserByToken("validToken")).thenReturn(userEntity);
        // Act
        boolean result = userBean.updateUser("validToken", userDto);

        // Assert
        assertTrue(result);
        //assertEquals("newPassword", userEntity.getPassword());
        assertEquals("John", userEntity.getFirstName());
        assertEquals("Doe", userEntity.getLastName());
    }

    @Test
    void testUpdateUser_UserNotFound() {
        // Arrange
        when(userDao.findUserByToken("invalidToken")).thenReturn(null);

        // Act
        boolean result = userBean.updateUser("invalidToken", userDto);

        // Assert
        assertFalse(result);
    }

    @Test
    void testDeleteUser_Success() {
        // Arrange
        String username = "testUser";
        when(userDao.deleteUser(username)).thenReturn(true);
        doNothing().when(productDao).setProductsOfUserToAnonymous(username);  // Mock productDao

        // Act
        boolean result = userBean.deleteUser(username);

        // Assert
        assertTrue(result);
        verify(productDao, times(1)).setProductsOfUserToAnonymous(username);  // Ensure the products are set to anonymous
        verify(userDao, times(1)).deleteUser(username);  // Verify deleteUser was called
    }

    @Test
    void testDeleteUser_Failure() {
        // Arrange
        String username = "testUser";
        when(userDao.deleteUser(username)).thenReturn(false);

        // Act
        boolean result = userBean.deleteUser(username);

        // Assert
        assertFalse(result);
    }

    @Test
    void testExcludeUser_Success() {
        // Arrange
        String username = "testUser";
        when(userDao.excludeUser(username)).thenReturn(true);
        doNothing().when(productDao).setProductsOfUserToExcluded(username);  // Mock productDao

        // Act
        boolean result = userBean.excludeUser(username);

        // Assert
        assertTrue(result);
        verify(userDao, times(1)).excludeUser(username);
        verify(productDao, times(1)).setProductsOfUserToExcluded(username);
    }

    @Test
    void testExcludeUser_Failure() {
        // Arrange
        String username = "testUser";
        when(userDao.excludeUser(username)).thenReturn(false);

        // Act
        boolean result = userBean.excludeUser(username);

        // Assert
        assertFalse(result);
    }

    @Test
    void testGetAllUsers_Success() {
        // Arrange
        List<UserEntity> userEntityList = new ArrayList<>();
        userEntityList.add(getUserEntity1());  // Add mock user entities
        userEntityList.add(getUserEntity1());

        when(userDao.getAllUsers()).thenReturn(userEntityList);
        Set<UserDto> expectedUserDtos = new HashSet<>();
        expectedUserDtos.add(new UserDto());  // Add mock user DTOs
        expectedUserDtos.add(new UserDto());

        // Act
        Set<UserDto> result = userBean.getAllUsers();

        // Assert
        assertNotNull(result);
        assertEquals(expectedUserDtos.size(), result.size());
        verify(userDao, times(1)).getAllUsers();  // Ensure userDao.getAllUsers() was called
    }

    @Test
    void testGetAllUsers_Failure() {
        // Arrange
        when(userDao.getAllUsers()).thenThrow(new RuntimeException("Error"));

        // Act
        Set<UserDto> result = userBean.getAllUsers();

        // Assert
        assertNull(result);
    }

    //Erro ao testar métodos void
    /*
    @Test
    void testAddProduct_Success() {
        // Arrange
        ProductEntity productEntity = new ProductEntity();
        when(productDao.persist(productEntity)).thenReturn(true);  // Mock productDao persist

        // Act
        boolean result = productBean.addProduct(userDto, newProductDto);

        // Assert
        assertTrue(result);  // Assert that product was added successfully
        verify(productDao, times(1)).persist(any(ProductEntity.class));  // Ensure persist was called once
    }

    @Test
    void testAddProduct_Failure() {
        // Arrange
        when(productDao.persist(any(ProductEntity.class))).thenThrow(new RuntimeException("Error"));

        // Act
        boolean result = productBean.addProduct(userDto, newProductDto);

        // Assert
        assertFalse(result);  // Assert that the product addition failed
    }
*/

    @Test
    void testUpdateProduct_Success() {
        // Arrange
        ProductDto productDto = getProductDto1();
        productDto.setName("updatedTV");
        productDto.setDescription("updated TV description");
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setNome("tecnologia");
        UserEntity userEntity = getUserEntity1();
        ProductEntity productEntity = getProductEntity1(userEntity,categoryEntity);
        when(productDao.getProductById(111)).thenReturn(productEntity);  // Mock getting product by ID
        when(categoryDao.findCategoryByName("tecnologia")).thenReturn(categoryEntity);  // Mock category lookup

        // Act
        boolean result = userBean.updateProduct(productDto);

        // Assert
        assertTrue(result);  // Assert that product was updated successfully
        assertEquals("updatedTV", productEntity.getName());  // Ensure product name is updated
        assertEquals("updated TV description", productEntity.getDescription());  // Ensure description is updated
        verify(productDao, times(1)).getProductById(111);  // Ensure getProductById was called once
    }

    @Test
    void testUpdateProduct_Failure() {
        // Arrange
        ProductDto productDto = new ProductDto();
        productDto.setId(1);
        when(productDao.getProductById(1)).thenThrow(new RuntimeException("Error"));

        // Act
        boolean result = userBean.updateProduct(productDto);

        // Assert
        assertFalse(result);  // Assert that product update failed
    }

    @Test
    void testExcludeProduct_Success() {
        // Arrange
        int productId = 1;
        doNothing().when(productDao).excludeProduct(productId);  // Mock productDao excludeProduct method

        // Act
        boolean result = userBean.excludeProduct(productId);

        // Assert
        assertTrue(result);  // Assert that the product was excluded successfully
        verify(productDao, times(1)).excludeProduct(productId);  // Ensure excludeProduct was called
    }

    @Test
    void testExcludeProduct_Failure() {
        // Arrange
        int productId = 1;
        doThrow(new RuntimeException("Error")).when(productDao).excludeProduct(productId);  // Mock failure

        // Act
        boolean result = userBean.excludeProduct(productId);

        // Assert
        assertFalse(result);  // Assert that excluding the product failed
    }

    @Test
    void testDeleteProduct_Success() {
        // Arrange
        int productId = 1;
        doNothing().when(productDao).deleteProduct(productId);  // Mock productDao deleteProduct method

        // Act
        boolean result = userBean.deleteProduct(productId);

        // Assert
        assertTrue(result);  // Assert that the product was deleted successfully
        verify(productDao, times(1)).deleteProduct(productId);  // Ensure deleteProduct was called
    }

    @Test
    void testDeleteProduct_Failure() {
        // Arrange
        int productId = 1;
        doThrow(new RuntimeException("Error")).when(productDao).deleteProduct(productId);  // Mock failure

        // Act
        boolean result = userBean.deleteProduct(productId);

        // Assert
        assertFalse(result);  // Assert that deleting the product failed
    }

}
