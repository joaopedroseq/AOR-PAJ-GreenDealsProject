package pt.uc.dei.proj3.beans;

import java.io.Serializable;
import java.util.ArrayList;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;

@Stateless
public class UserBean implements Serializable {

    @Inject
    ApplicationBean applicationBean;


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
    }

    public boolean register(String firstName, String lastName, String username, String password, String email,String phoneNumber,String url){
        UserPojo u = applicationBean.getUser(username);
        if (u==null){
            UserDto newUserDto= new UserDto(firstName,lastName,username,password,email,phoneNumber,url);
            UserPojo newUserPojo =convertNewUserDtoToUser(newUserDto);
            applicationBean.addUser(newUserPojo);
            return true;
        }else
            return false;
    }

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