package pt.uc.dei.proj3.beans;

import java.io.Serializable;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;

import at.favre.lib.crypto.bcrypt.BCrypt;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dao.ProductDao;
import pt.uc.dei.proj3.dao.UserDao;
import pt.uc.dei.proj3.dto.LoginDto;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.StateId;
import pt.uc.dei.proj3.dto.UserDto;
import pt.uc.dei.proj3.entity.ProductEntity;
import pt.uc.dei.proj3.entity.UserEntity;

@Stateless
public class UserBean implements Serializable {

    private static final Logger logger = LogManager.getLogger(UserBean.class);
    @Inject
    ApplicationBean applicationBean;

    @Inject
    ProductBean productBean;

    @EJB
    UserDao userDao;

    @EJB
    CategoryDao categoryDao;

    @EJB
    ProductDao productDao;

    public UserBean() {
    }

    public boolean registerNormalUser(UserDto userDto) {
        UserEntity user = userDao.findUserByUsername(userDto.getUsername());
        if (user == null) {
            UserEntity newUserEntity = convertUserDtotoUserEntity(userDto);
            userDao.persist(newUserEntity);
            return true;
        } else
            return false;
    }

    public boolean registerAdmin(UserDto userDto) {
        UserEntity user = userDao.findUserByUsername(userDto.getUsername());
        if (user == null) {
            UserEntity newUserEntity = convertUserDtotoUserEntity(userDto);
            newUserEntity.setAdmin(true);
            userDao.persist(newUserEntity);
            return true;
        } else
            return false;
    }


    public String login(LoginDto user) {
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null) {
            BCrypt.Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), userEntity.getPassword());
            if (result.verified) {
                String token = generateNewToken();
                userEntity.setToken(token);
                return token;
            }
        }
        return null;
    }

    public boolean logout(String token) {
        UserEntity u = userDao.findUserByToken(token);
        if (u != null) {
            u.setToken(null);
            return true;
        }
        return false;
    }

    public UserDto verifyToken(String token) {
        try {
            return convertUserEntitytoUserDto(userDao.findUserByToken(token));
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    public boolean checkIfTokenValid(String token) {
        return userDao.findIfTokenExists(token);
    }

    public boolean checkIfUserExists(String username) {
        return userDao.findIfUserExists(username);
    }

    public boolean updateUser(String token, UserDto userDto) {
        UserEntity userToUpdate = userDao.findUserByToken(token);
        if (userToUpdate == null) {
            return false;
        } else {
            try {
                //não é feito set de username, admin ou excluded
                if (userDto.getPassword() != null) {
                    userToUpdate.setPassword(userDto.getPassword());
                }
                if (userDto.getFirstName() != null) {
                    userToUpdate.setFirstName(userDto.getFirstName());
                }
                if (userDto.getLastName() != null) {
                    userToUpdate.setLastName(userDto.getLastName());
                }
                if (userDto.getEmail() != null) {
                    userToUpdate.setEmail(userDto.getEmail());
                }
                if (userDto.getPhoneNumber() != null) {
                    userToUpdate.setPhoneNumber(userDto.getPhoneNumber());
                }
                if (userDto.getUrl() != null) {
                    userToUpdate.setUrl(userDto.getUrl());
                }
                if (userDto.getProducts() != null) {
                    userToUpdate.setProducts(convertGroupProductDtoToGroupProductEntity(userDto.getProducts()));
                }
                //adicionar evaluations
                return true;
            } catch (Exception e) {
                logger.error("Error in UserBean.updateUser - error {}", e.getMessage());
                return false;
            }
        }
    }

    public boolean deleteUser(String username) {
        try {
            productDao.setProductsOfUserToAnonymous(username);
            if (userDao.deleteUser(username)) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }

    public boolean deleteProductsOfUser(String usernameUserToDeleteProducts) {
        try {
            productDao.deleteProductsOfUser(usernameUserToDeleteProducts);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean excludeUser(String username) {
        try {
            if (userDao.excludeUser(username)) {
                productDao.setProductsOfUserToExcluded(username);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            logger.error("Error in UserBean.excludeUser - error {}", e.getMessage());
            return false;
        }
    }

    public Set<UserDto> getAllUsers() {
        try{
            List<UserEntity> userEntityList = userDao.getAllUsers();
            return convertGroupUserEntityToUserDto(userEntityList);
        }
        catch(Exception e) {
            logger.error("Error in UserBean.getAllUsers - error {}", e.getMessage());
            return null;
        }
    }


    public boolean addProduct(UserDto userDto, ProductDto newProductDto) {
        try {
            ProductDto completeProductDto = new ProductDto(newProductDto);
            ProductEntity product = convertSingleProductDtotoProductEntity(completeProductDto);
            productDao.persist(product);
            return true;
        } catch (Exception e) {
            logger.error("Error while adding product to user {}", userDto.getUsername());
            //logger.error(e.getMessage());
            return false;
        }
    }

    public boolean updateProduct(ProductDto productDto) {
        try {
            System.out.println("updating product.\nproduct: " + productDto);
            ProductEntity productEntity = productDao.getProductById(productDto.getId());
            productEntity.setName(productDto.getName());
            productEntity.setDescription(productDto.getDescription());
            productEntity.setPrice(productDto.getPrice());
            productEntity.setLocation(productDto.getLocation());
            productEntity.setDate(productDto.getDate());
            productEntity.setEditedDate(LocalDateTime.now());
            productEntity.setSeller(productEntity.getSeller());
            productEntity.setCategory(categoryDao.findCategoryByName(productDto.getCategory()));
            StateId state = StateId.RASCUNHO;
            productEntity.setState(state.intFromStateId(productDto.getState()));
            productEntity.setUrlImage(productDto.getUrlImage());
            productEntity.setExcluded(productDto.isExcluded());
            return true;
        } catch (Exception e) {
            logger.error("Error updating product {}", productDto.getId());
            logger.error(e);
            return false;
        }
    }

    public boolean excludeProduct(int productId) {
        try {
            productDao.excludeProduct(productId);
            return true;
        } catch (Exception e) {
            logger.error("Error while excluding product {}", productId);
            logger.error(e);
            return false;
        }
    }

    public boolean deleteProduct(int productId) {
        try {
            productDao.deleteProduct(productId);
            return true;
        } catch (Exception e) {
            logger.error("Error while deleting product {}", productId);
            logger.error(e);
            return false;
        }
    }

    //Converts
    private Set<UserDto> convertGroupUserEntityToUserDto(List<UserEntity> userEntities) {
        Set<UserDto> userDtos = new HashSet<>();
        for (UserEntity userEntity : userEntities) {
            userDtos.add(convertUserEntitytoUserDto(userEntity));
        }
        return userDtos;
    }

    private UserEntity convertUserDtotoUserEntity(UserDto user) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setPassword(user.getPassword());
        userEntity.setFirstName(user.getFirstName());
        userEntity.setLastName(user.getLastName());
        userEntity.setEmail(user.getEmail());
        userEntity.setPhoneNumber(user.getPhoneNumber());
        userEntity.setUrl(user.getUrl());
        userEntity.setAdmin(false);
        userEntity.setExcluded(false);
        return userEntity;
    }

    private UserDto convertUserEntitytoUserDto(UserEntity user) {
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setPassword(user.getPassword());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setUrl(user.getUrl());
        userDto.setAdmin(user.getAdmin());
        userDto.setExcluded(user.getExcluded());
        userDto.setProducts(convertGroupProductEntityToGroupProductDto(user.getProducts()));
        //userDto.setEvaluationsReceived(user.getEvaluationsReceived());
        return userDto;
    }

    public Set<ProductDto> getActiveProducts() {
        try {
            List<ProductEntity> products = productDao.getActiveProducts();
            Set<ProductEntity> productSet = new HashSet<>(products);
            return convertGroupProductEntityToGroupProductDto(productSet);
        } catch (Exception e) {
            logger.error("Error while getting active products");
            logger.error(e);
            return null;
        }
    }


    public Set<ProductDto> getAllProducts() {
        try {
            List<ProductEntity> products = productDao.getAllProducts();
            Set<ProductEntity> productSet = new HashSet<>(products);
            return convertGroupProductEntityToGroupProductDto(productSet);
        } catch (Exception e) {
            logger.error("Error while getting active products");
            logger.error(e);
            return null;
        }
    }

    public Set<ProductDto> getEditedProducts() {
        try {
            List<ProductEntity> products = productDao.getEditedProducts();
            Set<ProductEntity> productSet = new HashSet<>(products);
            return convertGroupProductEntityToGroupProductDto(productSet);
        } catch (Exception e) {
            logger.error("Error while getting active products");
            logger.error(e);
            return null;
        }
    }

    public Set<ProductDto> getActiveProductsByUser(String username) {
        try {
            List<ProductEntity> products = productDao.getActiveProductsByUser(username);
            Set<ProductEntity> productSet = new HashSet<>(products);
            return convertGroupProductEntityToGroupProductDto(productSet);
        } catch (Exception e) {
            logger.error("Error while getting active products");
            logger.error(e);
            return null;
        }
    }

    public Set<ProductDto> getAvailableProducts() {
        try {
            List<ProductEntity> products = productDao.getAvailableProducts();
            Set<ProductEntity> productSet = new HashSet<>(products);
            return convertGroupProductEntityToGroupProductDto(productSet);
        } catch (Exception e) {
            logger.error("Error while getting available products");
            logger.error(e);
            return null;
        }
    }


    public Set<ProductDto> convertGroupProductEntityToGroupProductDto(Set<ProductEntity> products) {
        Set<ProductDto> productDtos = new HashSet<>();
        for (ProductEntity productEntity : products) {
            ProductDto produto = convertSingleProductEntitytoProductDto(productEntity);
            productDtos.add(produto);
        }
        return productDtos;
    }

    private Set<ProductEntity> convertGroupProductDtoToGroupProductEntity(Set<ProductDto> products) {
        Set<ProductEntity> productEntities = new HashSet<>();
        for (ProductDto productDto : products) {
            ProductEntity productEntity = convertSingleProductDtotoProductEntity(productDto);
            productEntities.add(productEntity);
        }
        return productEntities;
    }

    public ProductEntity convertSingleProductDtotoProductEntity(ProductDto productDto) {
        ProductEntity product = new ProductEntity();
        product.setId(productDto.getId());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setName(productDto.getName());
        product.setExcluded(productDto.isExcluded());
        product.setDate(productDto.getDate());
        product.setEditedDate(productDto.getEdited());
        product.setLocation(productDto.getLocation());
        StateId state = StateId.RASCUNHO;
        int stateInt = state.intFromStateId(productDto.getState());
        product.setState(stateInt);
        product.setSeller(userDao.findUserByUsername(productDto.getSeller()));
        product.setCategory(categoryDao.findCategoryByName(productDto.getCategory()));
        product.setUrlImage(productDto.getUrlImage());
        return product;
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

    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom(); //threadsafe
        Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

}