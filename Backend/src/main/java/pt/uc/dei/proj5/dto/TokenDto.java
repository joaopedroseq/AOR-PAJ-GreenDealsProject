package pt.uc.dei.proj5.dto;

import java.time.LocalDateTime;

public class TokenDto {
    //Atributes
    private String usernmame;
    private String authenticationToken;
    private LocalDateTime authenticationTokenDate;
    private String confirmationToken;
    private LocalDateTime confirmationTokenDate;
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
