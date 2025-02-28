package pt.uc.dei.proj3.beans;

import java.io.Serializable;
import java.util.ArrayList;
//import java.util.logging.Logger;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import pt.uc.dei.proj3.dao.UserDao;
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

    /*
    public String login (UserDto userDto) {
        UserPojo u = applicationBean.getLogin(username,password);
        if(u!= null){
            loginBean.setCurrentUser(u);
            return true;
        } else {
            return false;
        }
    }

    public boolean checkPassword (String username, String password) {
        UserPojo u = applicationBean.getLogin(username,password);
        if(u!= null){
            return true;
        } else {
            return false;
        }
    }*/

    public boolean register(UserDto userDto) {
        UserEntity user = userDao.findUserByUsername(userDto.getUsername());
        if (user==null){
            UserEntity newUserDto= convertUserDtotoUserEntity(userDto);
          //  applicationBean.addUser(newUserPojo);
            return true;
        }else
            return false;
    }

    private UserEntity convertUserDtotoUserEntity(UserDto user){
        UserEntity userEntity = new UserEntity();
        userEntity.setFirstName(user.getFirstName());
        userEntity.setLastName(user.getLastName());
        userEntity.setUsername(user.getUsername());
        userEntity.setPassword(user.getPassword());
        userEntity.setEmail(user.getEmail());
        userEntity.setPhoneNumber(user.getPhoneNumber());
        userEntity.setUrl(user.getUrl());
        return userEntity;
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

    //Converts
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


}