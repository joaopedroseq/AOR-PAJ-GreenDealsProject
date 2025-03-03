package pt.uc.dei.proj3.dto;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

import java.io.Serializable;

@XmlRootElement
public class LoginDto implements Serializable {
    private String username;
    private String password;

    @XmlElement
    public String getPassword() {
        return password;
    }

    @XmlElement
    public void setPassword(String password) {
        this.password = password;
    }

    @XmlElement
    public String getUsername() {
        return username;
    }

    @XmlElement
    public void setUsername(String username) {
        this.username = username;
    }

    public boolean isValid() {
        return this.username != null && !this.username.isEmpty()
                && this.password != null && !this.password.isEmpty();
    }
}
