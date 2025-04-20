package pt.uc.dei.proj5.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;


@NamedQuery(name = "Configuration.getLatestConfiguration", query = "SELECT configuration FROM ConfigurationEntity configuration ORDER BY configuration.id DESC")
@Entity
@Table(name="configuration", indexes = {
        @Index(name = "idx_latest_configuration", columnList = "id DESC"),
        @Index(name = "idx_admin_updates", columnList = "updatedByAdmin")
})
public class ConfigurationEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Em minutos
    @Column(name="authenticationExpirationTime", nullable=false)
    private int authenticationExpirationTime;

    //Em minutos
    @Column(name="activationExpirationTime", nullable=false)
    private int activationExpirationTime;

    //Em minutos
    @Column(name="passowordChangeExpirationTime", nullable=false)
    private int passwordChangeExpirationTime;

    @ManyToOne
    @JoinColumn(name = "updatedByAdmin")
    private UserEntity user;

    @Column(name="dateOfUpdate", nullable=false)
    private LocalDateTime dateOfUpdate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getAuthenticationExpirationTime() {
        return authenticationExpirationTime;
    }

    public void setAuthenticationExpirationTime(int authenticationExpirationTime) {
        this.authenticationExpirationTime = authenticationExpirationTime;
    }

    public int getActivationExpirationTime() {
        return activationExpirationTime;
    }

    public void setActivationExpirationTime(int activationExpirationTime) {
        this.activationExpirationTime = activationExpirationTime;
    }

    public int getPasswordChangeExpirationTime() {
        return passwordChangeExpirationTime;
    }

    public void setPasswordChangeExpirationTime(int passwordChangeExpirationTime) {
        this.passwordChangeExpirationTime = passwordChangeExpirationTime;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public LocalDateTime getDateOfUpdate() {
        return dateOfUpdate;
    }

    public void setDateOfUpdate(LocalDateTime dateOfUpdate) {
        this.dateOfUpdate = dateOfUpdate;
    }
}
