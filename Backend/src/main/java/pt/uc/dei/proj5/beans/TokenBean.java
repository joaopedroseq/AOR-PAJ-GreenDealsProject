package pt.uc.dei.proj5.beans;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dao.TokenDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.LoginDto;
import pt.uc.dei.proj5.dto.UserDto;
import pt.uc.dei.proj5.entity.TokenEntity;
import pt.uc.dei.proj5.entity.UserEntity;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;

@Stateless
public class TokenBean {
    private static final Logger logger = LogManager.getLogger(UserBean.class);

    @EJB
    UserDao userDao;

    @EJB
    TokenDao tokenDao;

    @EJB
    UserBean userBean;

    //Operação para login
    public String login(LoginDto user) {
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null) {
            BCrypt.Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), userEntity.getPassword());
            if (result.verified) {
                String newAuthenticationToken = generateNewToken();
                TokenEntity tokenEntity = tokenDao.findTokenByUsername(userEntity.getUsername());
                if(tokenEntity == null) {
                    tokenEntity = new TokenEntity();
                    tokenEntity.setUser(userEntity);
                }
                tokenEntity.setAuthenticationToken(newAuthenticationToken);
                tokenEntity.setAuthenticationTokenDate(LocalDateTime.now());
                return newAuthenticationToken;
            }
        }
        return null;
    }

    public boolean logout(String authenticationToken) {
        TokenEntity tokenEntity = tokenDao.findTokenByAuthenticationToken(authenticationToken);
        if (tokenEntity != null) {
            tokenEntity.setAuthenticationToken(null);
            tokenEntity.setAuthenticationTokenDate(null);
            return true;
        }
        return false;
    }

    public UserDto verifyAuthenticationToken(String authenticationToken) {
        try {
            UserEntity userEntity = tokenDao.findUserByAuthenticationToken(authenticationToken);
            return userBean.convertUserEntitytoUserDto(userEntity);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    public boolean checkIfAuthenticationTokenValid(String authenticationToken) {
        return tokenDao.findIfAuthenticationTokenExists(authenticationToken);
    }


    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom(); //threadsafe
        Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }
}