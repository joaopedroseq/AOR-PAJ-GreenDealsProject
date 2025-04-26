package pt.uc.dei.proj5.beans;

import java.io.Serializable;
import java.util.*;

import at.favre.lib.crypto.bcrypt.BCrypt;

import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import pt.uc.dei.proj5.dao.ProductDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.*;
import pt.uc.dei.proj5.entity.ProductEntity;
import pt.uc.dei.proj5.entity.TokenEntity;
import pt.uc.dei.proj5.entity.UserEntity;
import pt.uc.dei.proj5.websocket.wsProducts;
import pt.uc.dei.proj5.websocket.WsUsers;

@Stateless
public class UserBean implements Serializable {

    private static final Logger logger = LogManager.getLogger(UserBean.class);

    @EJB
    UserDao userDao;

    @EJB
    ProductBean productBean;

    @EJB
    ProductDao productDao;

    @Inject
    wsProducts wsProducts;

    @Inject
    WsUsers wsUsers;

    @Inject
    TokenBean tokenBean;

    public UserBean() {
    }

    public Set<UserDto> getUsers(String username, String firstName, String lastName, String email, String phone, UserAccountState state, UserParameter parameter, Order order) {
        try{
            List<UserEntity> userEntities = userDao.getFilteredUsers(username, firstName, lastName, email, phone, state, parameter, order);
            Set<UserDto> userDtos = new HashSet<>();
            if (userEntities == null) {
                return Collections.emptySet();
            }
            for (UserEntity userEntity : userEntities) {
                UserDto userDto = convertUserEntitytoUserDto(userEntity);
                userDtos.add(userDto);
            }
            for (UserDto userDto : userDtos) {
                logger.info("User DTO: " + userDto);
            }
            return userDtos;
        }
        catch(Exception e){
            logger.error("Error fetching users: ", e);
            return Collections.emptySet();
        }
    }

    public String registerNormalUser(UserDto userDto) {
        UserEntity user = userDao.findUserByUsername(userDto.getUsername());
        if (user == null) {
            UserEntity newUserEntity = convertUserDtotoUserEntity(userDto);
            newUserEntity.setAdmin(false);
            newUserEntity.setState(UserAccountState.INACTIVE);
            newUserEntity.setTokens(new HashSet<>()); // Initialize empty set
            String newActivationToken = tokenBean.generateNewToken();
            TokenEntity activationToken = new TokenEntity(newUserEntity, newActivationToken, TokenType.ACTIVATION);
            // Ensure the user has a token list, then add the new activation token
            newUserEntity.getTokens().add(activationToken);
            userDao.persist(newUserEntity);
            return newActivationToken;
        } else
            return null;
    }

    public boolean registerAdmin(UserDto userDto) {
        UserEntity user = userDao.findUserByUsername(userDto.getUsername());
        if (user == null) {
            UserEntity newUserEntity = convertUserDtotoUserEntity(userDto);
            newUserEntity.setAdmin(true);
            newUserEntity.setState(UserAccountState.ACTIVE);
            newUserEntity.setTokens(new HashSet<>());
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
                wsUsers.broadcastUser(userDto, "UPDATE");
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

    public boolean addProduct(UserDto userDto, ProductDto newProductDto) {
        try {
            ProductDto completeProductDto = new ProductDto(newProductDto);
            ProductEntity product = productBean.convertSingleProductDtotoProductEntity(completeProductDto);
            productDao.persist(product);
            wsProducts.broadcastProduct(completeProductDto, "NEW");
            return true;
        } catch (Exception e) {
            logger.error("Error while adding product to user {}", userDto.getUsername());
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
            ProductDto produto = productBean.convertSingleProductEntitytoProductDto(productEntity);
            productDtos.add(produto);
        }
        return productDtos;
    }

    private Set<ProductEntity> convertGroupProductDtoToGroupProductEntity(Set<ProductDto> products) {
        Set<ProductEntity> productEntities = new HashSet<>();
        for (ProductDto productDto : products) {
            ProductEntity productEntity = productBean.convertSingleProductDtotoProductEntity(productDto);
            productEntities.add(productEntity);
        }
        return productEntities;
    }





}