package pt.uc.dei.proj5.dto;

import java.time.LocalDateTime;

public class TokenDto {
    //Atributes
    private String usernmame;
    private String authenticationToken;
    private LocalDateTime authenticationTokenDate;
    private String activationToken;
    private LocalDateTime activationTokenDate;
    private String passwordChangeToken;
    private LocalDateTime passwordChangeTokenDate;

    public TokenDto() {
    }

    public String getUsernmame() {
        return usernmame;
    }

    public void setUsernmame(String usernmame) {
        this.usernmame = usernmame;
    }

    public String getAuthenticationToken() {
        return authenticationToken;
    }

    public void setAuthenticationToken(String authenticationToken) {
        this.authenticationToken = authenticationToken;
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

    public LocalDateTime getAuthenticationTokenDate() {
        return authenticationTokenDate;
    }

    public void setAuthenticationTokenDate(LocalDateTime authenticationTokenDate) {
        this.authenticationTokenDate = authenticationTokenDate;
    }
}
