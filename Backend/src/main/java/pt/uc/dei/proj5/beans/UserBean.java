package pt.uc.dei.proj5.beans;

import java.io.Serializable;
import java.security.SecureRandom;
import java.util.*;

import at.favre.lib.crypto.bcrypt.BCrypt;

import jakarta.jws.soap.SOAPBinding;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import pt.uc.dei.proj5.dao.CategoryDao;
import pt.uc.dei.proj5.dao.ProductDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.*;
import pt.uc.dei.proj5.entity.ProductEntity;
import pt.uc.dei.proj5.entity.TokenEntity;
import pt.uc.dei.proj5.entity.UserEntity;

@Stateless
public class UserBean implements Serializable {

    private static final Logger logger = LogManager.getLogger(UserBean.class);

    @EJB
    UserDao userDao;

    @EJB
    CategoryDao categoryDao;

    @EJB
    ProductDao productDao;

    public UserBean() {
    }

    public Set<UserDto> getUsers(String username, String firstName, String lastName, String email, String phone, UserAccountState state, UserParameter parameter, Order order) {
        try{
            List<UserEntity> userEntities = userDao.getFilteredUsers(username, firstName, lastName, email, phone, state, parameter, order);
            Set<UserDto> userDtos = new HashSet<>();
            for (UserEntity userEntity : userEntities) {
                UserDto userDto = convertUserEntitytoUserDto(userEntity);
                userDtos.add(userDto);
            }
            for (UserDto userDto : userDtos) {
                System.out.println(userDto);
            }
            return userDtos;
        }
        catch(Exception e){
            logger.error(e);
            return null;
        }
    }

    public boolean registerNormalUser(UserDto userDto) {
        UserEntity user = userDao.findUserByUsername(userDto.getUsername());
        if (user == null) {
            UserEntity newUserEntity = convertUserDtotoUserEntity(userDto);
            newUserEntity.setAdmin(false);
            newUserEntity.setState(UserAccountState.INACTIVE);
            TokenEntity tokenEntity = new TokenEntity();
            tokenEntity.setUser(newUserEntity);
            newUserEntity.setToken(tokenEntity);
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
            newUserEntity.setState(UserAccountState.ACTIVE);
            TokenEntity tokenEntity = new TokenEntity();
            tokenEntity.setUser(newUserEntity);
            userDao.persist(newUserEntity);
            return true;
        } else
            return false;
    }

    public boolean checkPassword(LoginDto user) {
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null) {
            BCrypt.Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), userEntity.getPassword());
            if (result.verified) {
                return true;
            }
            return false;
        }
        return false;
    }


    public UserDto getUserInformation(String username) {
        try {
            return convertUserEntitytoUserDto(userDao.findUserByUsername(username));
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }


    public boolean checkIfUserExists(String username) {
        return userDao.findIfUserExists(username);
    }

    public boolean updateUser(String username, UserDto userDto) {
        UserEntity userToUpdate = userDao.findUserByUsername(username);
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
                if (userDto.getState() != null) {
                    userToUpdate.setState(userDto.getState());
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
            if(!userDao.findIfAnonymousExists()){
                UserEntity anonymous = new UserEntity();
                anonymous.setUsername("anonymous");
                anonymous.setPassword("admin");
                anonymous.setAdmin(true);
                anonymous.setEmail("-");
                anonymous.setState(UserAccountState.ACTIVE);
                anonymous.setFirstName("anonymous");
                anonymous.setLastName("-");
                anonymous.setPhoneNumber("-1");
                anonymous.setUrl("-");
                userDao.persist(anonymous);
            }
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

    public ArrayList<UserDto> getAllUsers() {
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



    //Deprecated - provavelmente para apagar
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



    //Converts
    private ArrayList<UserDto> convertGroupUserEntityToUserDto(List<UserEntity> userEntities) {
        ArrayList<UserDto> userDtos = new ArrayList<>();
        for (UserEntity userEntity : userEntities) {
            userDtos.add(convertUserEntitytoUserDto(userEntity));
        }
        return userDtos;
    }

    public UserEntity convertUserDtotoUserEntity(UserDto user) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setPassword(user.getPassword());
        userEntity.setFirstName(user.getFirstName());
        userEntity.setLastName(user.getLastName());
        userEntity.setEmail(user.getEmail());
        userEntity.setPhoneNumber(user.getPhoneNumber());
        userEntity.setUrl(user.getUrl());
        userEntity.setAdmin(user.getAdmin());
        userEntity.setState(user.getState());
        return userEntity;
    }

    public UserDto convertUserEntitytoUserDto(UserEntity user) {
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        //userDto.setPassword(user.getPassword());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setUrl(user.getUrl());
        userDto.setAdmin(user.getAdmin());
        userDto.setState(user.getState());
        userDto.setProducts(convertGroupProductEntityToGroupProductDto(user.getProducts()));
        //userDto.setEvaluationsReceived(user.getEvaluationsReceived());
        return userDto;
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
        product.setState(productDto.getState());
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
        produto.setState(productEntity.getState());
        produto.setSeller(productEntity.getSeller().getUsername());
        produto.setCategory(productEntity.getCategory().getNome());
        produto.setUrlImage(productEntity.getUrlImage());
        produto.setEdited(productEntity.getEditedDate());
        produto.setExcluded(productEntity.getExcluded());
        return produto;
    }



}