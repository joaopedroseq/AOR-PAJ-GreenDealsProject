package pt.uc.dei.proj5.entity;

import jakarta.jws.soap.SOAPBinding;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;



//to login
@NamedQuery(name = "Token.findUserByAuthenticationToken", query = "SELECT token.user FROM TokenEntity token WHERE token.authenticationToken = :token")
//to find if token exists
@NamedQuery(name = "Token.findIfAuthenticationTokenExists", query = "SELECT token FROM TokenEntity token WHERE token.authenticationToken = :token")
//find by AutenticationToken
@NamedQuery(name = "Token.findTokenByAuthenticationToken", query = "SELECT token FROM TokenEntity token WHERE token.authenticationToken = :token")
//find by username
@NamedQuery(name = "Token.findTokenByUsername", query = "SELECT token FROM TokenEntity token WHERE token.user.username = :username")
@Entity
@Table(name="token")
public class TokenEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    private String username;

    @OneToOne
    @MapsId
    @JoinColumn(name = "username")
    private UserEntity user;

    @Column(name = "authenticationToken")
    private String authenticationToken;

    @Column(name = "authenticationTokenDate")
    private LocalDateTime authenticationTokenDate;

    @Column(name = "activationToken")
    private String confirmationToken;

    @Column(name = "activationTokenDate")
    private LocalDateTime confirmationTokenDate;

    @Column(name = "passwordChangeToken")
    private String passwordChangeToken;

    @Column(name = "passwordChangeTokenDate")
    private LocalDateTime passwordChangeTokenDate;

    //Constructor
    //Empty constructor
    public TokenEntity() {
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getAuthenticationToken() {
        return authenticationToken;
    }

    public void setAuthenticationToken(String authenticationToken) {
        this.authenticationToken = authenticationToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getAuthenticationTokenDate() {
        return authenticationTokenDate;
    }

    public void setAuthenticationTokenDate(LocalDateTime authenticationTokenDate) {
        this.authenticationTokenDate = authenticationTokenDate;
    }

    public String getConfirmationToken() {
        return confirmationToken;
    }

    public void setConfirmationToken(String confirmationToken) {
        this.confirmationToken = confirmationToken;
    }

    public LocalDateTime getConfirmationTokenDate() {
        return confirmationTokenDate;
    }

    public void setConfirmationTokenDate(LocalDateTime confirmationTokenDate) {
        this.confirmationTokenDate = confirmationTokenDate;
    }

    public String getPasswordChangeToken() {
        return passwordChangeToken;
    }

    public void setPasswordChangeToken(String passwordChangeToken) {
        this.passwordChangeToken = passwordChangeToken;
    }

    public LocalDateTime getPasswordChangeTokenDate() {
        return passwordChangeTokenDate;
    }

    public void setPasswordChangeTokenDate(LocalDateTime passwordChangeTokenDate) {
        this.passwordChangeTokenDate = passwordChangeTokenDate;
    }
}
