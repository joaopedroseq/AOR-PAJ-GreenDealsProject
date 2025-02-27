package pt.uc.dei.proj3.beans;

import java.io.Serializable;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.hibernate.collection.spi.PersistentBag;
import pt.uc.dei.proj3.dao.UserDao;
import pt.uc.dei.proj3.dto.LoginDto;
import pt.uc.dei.proj3.dto.UserDto;
import pt.uc.dei.proj3.entity.UserEntity;

@Stateless
public class UserBean implements Serializable {

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



    /*
    public boolean checkPassword (String username, String password) {
        UserPojo u = applicationBean.getLogin(username,password);
        if(u!= null){
            return true;
        } else {
            return false;
        }
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
    private UserPojo convertUserDtoToUser(UserDto ud){
        ArrayList<ProductPojo>productsPojo = new ArrayList<>();
        if(ud.getProducts() != null){
            for(ProductDto productDto: ud.getProducts()){
                productsPojo.add(applicationBean.convertProductDtoToProduct(productDto));
            }
        }
        UserPojo userPojo = new UserPojo(ud.getFirstName(), ud.getLastName(),ud.getUsername(),ud.getPassword(), ud.getEmail(), ud.getPhoneNumber(), ud.getUrl(), productsPojo, ud.getEvaluations(), ud.getEvaluationCounts());
        return userPojo;
    }

    private UserDto convertUserToUserDto(UserPojo up){
        ArrayList<ProductDto>productDtos = new ArrayList<>();
        if(up.getProductPojos() != null){
            for(ProductPojo productPojo: up.getProductPojos()){
                productDtos.add(applicationBean.convertProductToProductDto(productPojo));
            }
        }
        UserDto userDto = new UserDto(up.getFirstName(), up.getLastName(),up.getUsername(),up.getPassword(), up.getEmail(), up.getPhoneNumber(), up.getUrl(), productDtos, up.getEvaluations(), up.getEvaluationCounts());
        return userDto;
    }*/

    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom(); //threadsafe
        Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

}