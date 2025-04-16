package pt.uc.dei.proj5.entity;

import jakarta.jws.soap.SOAPBinding;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;



//to login
@NamedQuery(name = "Token.findUserByAuthenticationToken", query = "SELECT token.user FROM TokenEntity token WHERE token.authenticationToken = :token")
//to logout
@NamedQuery(name = "Token.removeAuthenticationToken", query = "UPDATE TokenEntity token " +
        "SET token.authenticationToken = NULL, token.authenticationTokenDate = NULL WHERE token.authenticationToken = :authenticationToken")
//to activate account
@NamedQuery(name = "Token.findUserByActivationToken", query = "SELECT token.user FROM TokenEntity token WHERE token.activationToken = :token")
//to change password
@NamedQuery(name = "Token.findUserByPasswordChangeToken", query = "SELECT token.user FROM TokenEntity token WHERE token.passwordChangeToken = :token")

//find Token by AutenticationToken
@NamedQuery(name = "Token.findTokenByAuthenticationToken", query = "SELECT token FROM TokenEntity token WHERE token.authenticationToken = :token")
//find Token by AutenticationToken
@NamedQuery(name = "Token.findTokenByActivationToken", query = "SELECT token FROM TokenEntity token WHERE token.activationToken = :token")
//to find if authentication token exists
@NamedQuery(name = "Token.findIfAuthenticationTokenExists", query = "SELECT token FROM TokenEntity token WHERE token.authenticationToken = :token")
//find by username
@NamedQuery(name = "Token.findTokenByUsername", query = "SELECT token FROM TokenEntity token WHERE token.user.username = :username")
//Delete token
@NamedQuery(name= "Token.deleteToken", query ="DELETE FROM TokenEntity WHERE username = :username")
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
    private String activationToken;

    @Column(name = "activationTokenDate")
    private LocalDateTime activationTokenDate;

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
        return activationToken;
    }

    public void setConfirmationToken(String activationToken) {
        this.activationToken = activationToken;
    }

    public String getActivationToken() {
        return activationToken;
    }

    public void setActivationToken(String activationToken) {
        this.activationToken = activationToken;
    }

    public LocalDateTime getActivationTokenDate() {
        return activationTokenDate;
    }

    public void setActivationTokenDate(LocalDateTime activationTokenDate) {
        this.activationTokenDate = activationTokenDate;
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
