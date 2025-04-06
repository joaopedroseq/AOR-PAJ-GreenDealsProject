package pt.uc.dei.proj5.dto;

import jakarta.ejb.Local;
import jakarta.persistence.*;
import jakarta.xml.bind.annotation.XmlRootElement;
import pt.uc.dei.proj5.entity.UserEntity;

import java.time.LocalDateTime;

public class ConfigurationDto {
    private int authenticationExpirationTime;
    private int activationExpirationTime;
    private int passwordChangeExpirationTime;
    private String adminUsername;
    private LocalDateTime dateOfUpdate;

    public ConfigurationDto() {
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

    public String getAdminUsername() {
        return adminUsername;
    }

    public void setAdminUsername(String adminUsername) {
        this.adminUsername = adminUsername;
    }

    public LocalDateTime getDateOfUpdate() {
        return dateOfUpdate;
    }

    public void setDateOfUpdate(LocalDateTime dateOfUpdate) {
        this.dateOfUpdate = dateOfUpdate;
    }
}
