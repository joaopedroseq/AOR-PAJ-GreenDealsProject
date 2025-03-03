package pt.uc.dei.proj3.entity;

import jakarta.persistence.*;
import pt.uc.dei.proj3.dto.Evaluation;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Set;

@Entity
@Table(name="userpojo")
//to find if username is avaiable
@NamedQuery(name = "User.findUserByUsername", query = "SELECT DISTINCT u FROM UserEntity u WHERE u.username = :username")
//to login
@NamedQuery(name = "User.findUserByToken", query = "SELECT DISTINCT u FROM UserEntity u WHERE u.token = :token")
//to find if token exists
@NamedQuery(name = "User.findIfTokenExists", query = "SELECT token FROM UserEntity WHERE token = :token")
//to find if user exists
@NamedQuery(name = "User.findIfUserExists", query = "SELECT username FROM UserEntity WHERE username = :username")
//delete user
@NamedQuery(name="User.deleteUser", query = "DELETE FROM UserEntity WHERE username = :username")
//exclude user
@NamedQuery(name="User.excludeUser", query = "UPDATE UserEntity SET excluded = true WHERE username = :username")
//get all non-admin users
@NamedQuery(name="User.getAllUsers", query = "SELECT u FROM UserEntity u WHERE u.admin = false")
public class UserEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    //user unique username has ID - not updatable, unique, not null
    @Id
    @Column(name = "username", nullable = false, unique = true, updatable = false)
    private String username;

    //password
    @Column(name = "password", nullable = false, unique = false, updatable = true)
    private String password;

    //first name
    @Column(name = "firstname", nullable = false, unique = false, updatable = true)
    private String firstName;

    //last name
    @Column(name = "lastname", nullable = false, unique = false, updatable = true)
    private String lastName;

    //email
    @Column(name = "email", nullable = false, unique = false, updatable = true)
    private String email;

    //phone number
    @Column(name = "phonenumber", nullable = false, unique = false, updatable = true)
    private String phoneNumber;

    //Photo url
    @Column(name = "url", nullable = false, unique = false, updatable = true)
    private String url;

    //token
    @Column(name = "token", nullable = true, unique = true, updatable = true)
    private String token;

    //Admin - Boolean - is it an Administrator?
    @Column(name = "admin", nullable = false, unique = false, updatable = true)
    private Boolean admin;

    //Exluded - Boolean - is it excluded?
    @Column(name = "excluded", nullable = false, unique = false, updatable = true)
    private Boolean excluded;

    @OneToMany(mappedBy = "seller")
    private Set<ProductEntity> products;

    @OneToMany(mappedBy = "username")
    private Set<EvaluationEntity> evaluationsWritten;

    @OneToMany(mappedBy = "seller")
    private Set<EvaluationEntity> evaluationsReceived;

    //Constructors
    //Empty constructor
    public UserEntity() {
    }

    public Boolean getAdmin() {
        return admin;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getExcluded() {
        return excluded;
    }

    public void setExcluded(Boolean excluded) {
        this.excluded = excluded;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<EvaluationEntity> getEvaluationsReceived() {
        return evaluationsReceived;
    }

    public void setEvaluationsReceived(Set<EvaluationEntity> evaluationsReceived) {
        this.evaluationsReceived = evaluationsReceived;
    }

    public Set<EvaluationEntity> getEvaluationsWritten() {
        return evaluationsWritten;
    }

    public void setEvaluationsWritten(Set<EvaluationEntity> evaluationsWritten) {
        this.evaluationsWritten = evaluationsWritten;
    }

    public Set<ProductEntity> getProducts() {
        return products;
    }

    public void setProducts(Set<ProductEntity> products) {
        this.products = products;
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", url='" + url + '\'' +
                ", token='" + token + '\'' +
                ", admin=" + admin +
                ", excluded=" + excluded +
                ", products=" + products +
                ", evaluationsWritten=" + evaluationsWritten +
                ", evaluationsReceived=" + evaluationsReceived +
                '}';
    }
}


