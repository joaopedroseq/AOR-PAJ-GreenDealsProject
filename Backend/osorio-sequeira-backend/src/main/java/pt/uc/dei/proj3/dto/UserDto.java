package pt.uc.dei.proj3.dto;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.xml.bind.annotation.XmlRootElement;

import java.io.Serializable;
import java.util.Set;

@XmlRootElement
public class UserDto implements Serializable {

    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String url;
    private Boolean admin;
    private Boolean excluded;
    private Set<ProductDto> products;
    private Set<Evaluation> evaluationsReceived;
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

    //Construtor para conversão de Entity para Dto
    public UserDto(String firstName, String lastName, String username, String password, String email, String phoneNumber, String url, Boolean admin, Boolean excluded, Set<ProductDto> productDtos, Set<Evaluation> evaluationsReceived, EvaluationCounts ratings) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.url = url;
        this.admin = admin;
        this.excluded = excluded;
        this.products = productDtos;
        this.evaluationsReceived = evaluationsReceived;
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
        this.password = BCrypt.withDefaults().hashToString(10, password.toCharArray());
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

    public Set<Evaluation> getEvaluationsReceived() {
        return evaluationsReceived;
    }

    public void setEvaluationsReceived(Set<Evaluation> evaluationsReceived) {
        this.evaluationsReceived = evaluationsReceived;
    }

    public Set<ProductDto> getProducts() {
        return products;
    }

    public void setProducts(Set<ProductDto> products) {
        this.products = products;
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public Boolean getExcluded() {
        return excluded;
    }

    public void setExcluded(Boolean excluded) {
        this.excluded = excluded;
    }

    public boolean hasValidValues() {
        return this.firstName != null && !this.firstName.isEmpty()
                && this.lastName != null && !this.lastName.isEmpty()
                && this.username != null && !this.username.isEmpty()
                && this.password != null && !this.password.isEmpty()
                && this.phoneNumber != null && !this.phoneNumber.isEmpty()
                && this.email != null && !this.email.isEmpty()
                && this.url != null && !this.url.isEmpty();
    }
}