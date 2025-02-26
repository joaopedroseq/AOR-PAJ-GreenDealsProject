package pt.uc.dei.proj3.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;

@Entity
@Table(name="user")
@NamedQuery(name = "User.findUserByUsername", query = "SELECT u FROM UserEntity u WHERE u.username = :username")
@NamedQuery(name = "User.findUserByToken", query = "SELECT DISTINCT u FROM UserEntity u WHERE u.token = :token")
public class UserEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    //user unique username has ID - not updatable, unique, not null
    @Id
    @Column(name="username", nullable=false, unique = true, updatable = false)
    private String username;

    //password
    @Column(name="password", nullable=false, unique = false, updatable = true)
    private String password;

    //token
    @Column(name="token", nullable=true, unique = true, updatable = true)
    private String token;

    //first name
    @Column(name="firstname", nullable=false, unique = false, updatable = true)
    private String firstName;

    //last name
    @Column(name="lastname", nullable=false, unique = false, updatable = true)
    private String lastName;

    //email
    @Column(name="email", nullable=false, unique = false, updatable = true)
    private String email;

    //phone number
    @Column(name="phonenumber", nullable=false, unique = false, updatable = true)
    private String phoneNumber;

    //Admin - Boolean - is it an Administrator?
    @Column(name="admin", nullable=false, unique = false, updatable = true)
    private Boolean admin;

    //Photo url
    @Column(name="url", nullable=false, unique = false, updatable = true)
    private String url;

    //Exluded - Boolean - is it excluded?
    @Column(name="excluded", nullable=false, unique = false, updatable = true)
    private Boolean excluded;

    @OneToMany(mappedBy = "seller")
    private ArrayList<ProductEntity> products;

    //Constructors
    //Empty constructor
    public UserEntity() {}

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

    public ArrayList<ProductEntity> getProducts() {
        return products;
    }

    public void setProducts(ArrayList<ProductEntity> products) {
        this.products = products;
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
}