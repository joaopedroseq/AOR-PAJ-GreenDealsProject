package pt.uc.dei.proj5.entity;

import jakarta.persistence.*;
import pt.uc.dei.proj5.dto.TokenType;

import java.io.Serializable;
import java.time.LocalDateTime;


@Entity
@Table(name = "token", indexes = {
        @Index(name = "idx_token_value", columnList = "tokenValue"),
        @Index(name = "idx_token_user", columnList = "user_id")
})
@NamedQueries({
        @NamedQuery(name = "Token.findUserByToken",
                query = "SELECT token.user FROM TokenEntity token WHERE token.tokenValue = :token AND token.revoked = false"),
        @NamedQuery(name = "Token.revokeToken", query = "UPDATE TokenEntity token SET token.revoked = true WHERE token.tokenValue = :token"),
        @NamedQuery(name = "Token.findTokensByUser", query = "SELECT token FROM TokenEntity token WHERE token.user.username = :username"),
        @NamedQuery(name = "Token.findTokenByValue", query = "SELECT token FROM TokenEntity token WHERE token.tokenValue = :value"),
        @NamedQuery(name = "Token.deleteTokensByUser", query = "DELETE FROM TokenEntity token WHERE token.user.username = :username")
})
public class TokenEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Unique ID per token
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Allow multiple tokens per user
    private UserEntity user;

    @Column(name = "tokenValue", unique = true, nullable = false)
    private String tokenValue;

    @Column(name = "tokenType", nullable = false)
    @Enumerated(EnumType.STRING) // Defines the type of token
    private TokenType tokenType;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "revoked", nullable = false)
    private boolean revoked = false;

    // Empty constructor
    public TokenEntity() {
    }

    public TokenEntity(UserEntity user, String tokenValue, TokenType tokenType) {
        this.user = user;
        this.tokenValue = tokenValue;
        this.tokenType = tokenType;
        this.date = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getTokenValue() {
        return tokenValue;
    }

    public void setTokenValue(String tokenValue) {
        this.tokenValue = tokenValue;
    }

    public TokenType getTokenType() {
        return tokenType;
    }

    public void setTokenType(TokenType tokenType) {
        this.tokenType = tokenType;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime createdAt) {
        this.date = createdAt;
    }

    public boolean isRevoked() {
        return revoked;
    }

    public void setRevoked(boolean revoked) {
        this.revoked = revoked;
    }
}