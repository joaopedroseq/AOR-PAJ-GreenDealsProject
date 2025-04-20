package pt.uc.dei.proj5.entity;

import jakarta.persistence.*;
import pt.uc.dei.proj5.dto.UserAccountState;

import java.io.Serializable;
import java.util.Set;

//to find if username is avaiable
@NamedQuery(name = "User.findUserByUsername", query = "SELECT DISTINCT u FROM UserEntity u WHERE u.username = :username")

//to find if user exists
@NamedQuery(
        name = "User.findIfUserExists",
        query = "SELECT COUNT(u) FROM UserEntity u WHERE u.username = :username"
)

//find if anonymous exists
@NamedQuery(name = "User.findIfAnonymousExists", query = "SELECT username FROM UserEntity WHERE username = :anonymous")

//delete user
@NamedQuery(name="User.deleteUser", query = "DELETE FROM UserEntity WHERE username = :username")
//exclude user
@NamedQuery(name="User.excludeUser", query = "UPDATE UserEntity SET state = 'EXCLUDED' WHERE username = :username")
//get all non-admin users
@NamedQuery(name="User.getAllUsers", query = "SELECT u FROM UserEntity u WHERE u.admin = false ORDER BY username")


@Entity
@Table(name = "userAccount", indexes = {
        @Index(name = "idx_user_username", columnList = "username"),
        @Index(name = "idx_user_email", columnList = "email"),
        @Index(name = "idx_user_state", columnList = "state"),
        @Index(name = "idx_user_phone", columnList = "phonenumber")
})
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

    //Admin - Boolean - is it an Administrator?
    @Column(name = "admin", nullable = false, unique = false, updatable = true)
    private Boolean admin;

    //Pensar em juntar com o excluded num state de conta em que pode ser activated, exludede ou por ativar
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false, unique = false, updatable = true)
    private UserAccountState state;

    @OneToMany(mappedBy = "seller")
    private Set<ProductEntity> products;

    @OneToMany(mappedBy = "username")
    private Set<EvaluationEntity> evaluationsWritten;

    @OneToMany(mappedBy = "seller")
    private Set<EvaluationEntity> evaluationsReceived;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private TokenEntity token;


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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
        System.out.println("URL" + url);
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

    public UserAccountState getState() {
        return state;
    }

    public void setState(UserAccountState state) {
        this.state = state;
    }

    public TokenEntity getToken() {
        return token;
    }

    public void setToken(TokenEntity token) {
        this.token = token;
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
                ", admin=" + admin +
                ", state=" + state +
                ", products=" + products +
                ", evaluationsWritten=" + evaluationsWritten +
                ", evaluationsReceived=" + evaluationsReceived +
                ", token=" + token +
                '}';
    }
}


