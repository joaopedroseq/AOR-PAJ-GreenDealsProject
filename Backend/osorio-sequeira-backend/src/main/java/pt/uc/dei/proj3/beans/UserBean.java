package pt.uc.dei.proj3.beans;

import java.io.Serializable;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;

//import java.util.logging.Logger;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.hibernate.collection.spi.PersistentBag;
import pt.uc.dei.proj3.dao.UserDao;
import pt.uc.dei.proj3.dto.LoginDto;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.UserDto;
import pt.uc.dei.proj3.entity.UserEntity;

@Stateless
public class UserBean implements Serializable {

    private static final Logger logger = LogManager.getLogger(UserBean.class);
    @Inject
    ApplicationBean applicationBean;

    @EJB
    UserDao userDao;


    public UserBean() {
    }

    public boolean registerNormalUser(UserDto userDto) {
        UserEntity user = userDao.findUserByUsername(userDto.getUsername());
        if (user==null){
            UserEntity newUserEntity= convertUserDtotoUserEntity(userDto);
            userDao.persist(newUserEntity);
            return true;
        }else
            return false;
    }

    public boolean registerAdmin(UserDto userDto) {
        UserEntity user = userDao.findUserByUsername(userDto.getUsername());
        if (user==null){
            UserEntity newUserEntity= convertUserDtotoUserEntity(userDto);
            newUserEntity.setAdmin(true);
            userDao.persist(newUserEntity);
            return true;
        }else
            return false;
    }


    public String login(LoginDto user){
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null){
            if (userEntity.getPassword().equals(user.getPassword())){
                String token = generateNewToken();
                userEntity.setToken(token);
                return token;
            }
        }
        return null;
    }

    public boolean logout(String token) {
        UserEntity u= userDao.findUserByToken(token);
        if(u!=null){
            u.setToken(null);
            return true;
        }
        return false;
    }

    public UserEntity verifyToken(String token) {
        try {
            UserEntity user = userDao.findUserByToken(token);
            return user;
        }catch (Exception e){
            logger.error(e);
            return null;
        }
    }

    public boolean addProduct(UserEntity userEntity, ProductDto newProductDto) {

    }

    public UserDto getUserLogged(String token){
        UserEntity u= userDao.findUserByToken(token);
        if(u!=null){

        }
        else {
            return null;
        }
        return null;
    }


    /*
    private UserPojo convertNewUserDtoToUser(UserDto up){
        UserPojo userPojo = new UserPojo(up.getFirstName(), up.getLastName(),up.getUsername(),up.getPassword(), up.getEmail(), up.getPhoneNumber(), up.getUrl());
        return userPojo;
    }

    public ArrayList<UserPojo> getUsersAplicationBean() {
        return applicationBean.getUsers();
    }

    public UserPojo getUser(String username) {
        for (UserPojo u : applicationBean.getUsers()) {
            if (u.getUsername().equals(username)) {
                return u;
            }
        }
        return null;
    }

    public UserDto getUserDto(String username) {
        for (UserPojo u : applicationBean.getUsers()) {
            if (u.getUsername().equals(username)) {
                return convertUserToUserDto(u);
            }
        }
        return null;
    }

    public boolean updateUser(String username, UserDto userDto) {
        UserPojo userPojo = convertUserDtoToUser(userDto);
        boolean result = applicationBean.updateUser(username, userPojo);
        if (result) {
            applicationBean.writeUserIntoJsonFile();
        }
        return result;
    }
    */
    //Converts
    private UserEntity convertUserDtotoUserEntity(UserDto user){
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
/*
    private UserDto convertUserUserEntitytoUserDto(UserEntity user){
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
        userDto.setProducts(user.getProducts());
        userDto.setEvaluationsReceived(user.getEvaluationsReceived());
        return userDto;
    }
*/

    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom(); //threadsafe
        Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

}