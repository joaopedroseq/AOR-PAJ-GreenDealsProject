package pt.uc.dei.proj3.beans;

import jakarta.inject.Inject;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.UserDto;
import pt.uc.dei.proj3.pojo.Evaluation;
import pt.uc.dei.proj3.pojo.EvaluationCounts;
import pt.uc.dei.proj3.pojo.ProductPojo;
import pt.uc.dei.proj3.pojo.UserPojo;
import jakarta.enterprise.context.SessionScoped;

import java.io.Serializable;
import java.util.ArrayList;

@SessionScoped
public class LoginBean implements Serializable {
    UserPojo currentUserPojo;

    @Inject
    ApplicationBean applicationBean;

    public LoginBean() {
    }

    public LoginBean(UserPojo currentUserPojo) {
        this.currentUserPojo = currentUserPojo;
    }

    public String getCurrentUserUsername(){
        if (this.currentUserPojo != null){
            return this.currentUserPojo.getUsername();
        }
        return null;
    }

    public UserDto getCurrentUser() {
        if (this.currentUserPojo == null) {
            return null;
        } else {
            String firstName = this.currentUserPojo.getFirstName();
            String lastName = this.currentUserPojo.getLastName();
            String username = this.currentUserPojo.getUsername();
            String password = this.currentUserPojo.getPassword();
            String email = this.currentUserPojo.getEmail();
            String phoneNumber = this.currentUserPojo.getPhoneNumber();
            String url = this.currentUserPojo.getUrl();
            ArrayList<ProductDto> products = new ArrayList<>();
            if (this.currentUserPojo.getProductPojos() != null) {
                for (ProductPojo productPojo : this.currentUserPojo.getProductPojos()) {
                    ProductDto productDto = applicationBean.convertProductToProductDto(productPojo);
                    products.add(productDto);
                }
            }
            ArrayList<Evaluation> evaluations = this.currentUserPojo.getEvaluations();
            EvaluationCounts evaluationCounts = this.currentUserPojo.getEvaluationCounts();

            UserDto userDto = new UserDto(firstName, lastName, username, password, email, phoneNumber, url, products, evaluations, evaluationCounts);
            return userDto;
        }
    }

    public boolean checkIfLogged() {
        if (this.currentUserPojo == null) {
            return false;
        } else {
            return true;
        }
    }

    public void setCurrentUser(UserPojo currentUserPojo) {
        this.currentUserPojo = currentUserPojo;
    }
}
