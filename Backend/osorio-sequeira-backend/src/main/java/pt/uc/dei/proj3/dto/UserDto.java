package pt.uc.dei.proj3.dto;

import jakarta.xml.bind.annotation.XmlRootElement;

import java.io.Serializable;
import java.util.ArrayList;

@XmlRootElement
public class UserDto implements Serializable {

    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String url;
    private ArrayList<ProductDto> products;
    private ArrayList<Evaluation> evaluations;
    private EvaluationCounts evaluationCounts;


    public UserDto() {
    }

    //Construtor para criar novo user ou update do user
    public UserDto(String firstName, String lastName, String username, String password, String email, String phoneNumber, String url) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.url = url;
    }

    //Construtor para conversão de Pojo para Dto
    public UserDto(String firstName, String lastName, String username, String password, String email, String phoneNumber, String url, ArrayList<ProductDto> productDtos, ArrayList<Evaluation> evaluations, EvaluationCounts ratings) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.url = url;
        this.products = productDtos;
        this.evaluations = evaluations;
        this.evaluationCounts = ratings;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public EvaluationCounts getEvaluationCounts() {
        return evaluationCounts;
    }

    public void setEvaluationCounts(EvaluationCounts evaluationCounts) {
        this.evaluationCounts = evaluationCounts;
    }

    public ArrayList<Evaluation> getEvaluations() {
        return evaluations;
    }

    public void setEvaluations(ArrayList<Evaluation> evaluations) {
        this.evaluations = evaluations;
    }

    public ArrayList<ProductDto> getProducts() {
        return products;
    }

    public void setProducts(ArrayList<ProductDto> productDtos) {
        this.products = productDtos;
    }
}
