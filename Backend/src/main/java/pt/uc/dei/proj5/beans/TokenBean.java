package pt.uc.dei.proj5.beans;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dao.ConfigurationDao;
import pt.uc.dei.proj5.dao.TokenDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.LoginDto;
import pt.uc.dei.proj5.dto.TokenDto;
import pt.uc.dei.proj5.dto.TokenType;
import pt.uc.dei.proj5.dto.UserDto;
import pt.uc.dei.proj5.entity.ConfigurationEntity;
import pt.uc.dei.proj5.entity.TokenEntity;
import pt.uc.dei.proj5.entity.UserEntity;

import java.security.SecureRandom;
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
    ConfigurationDao configurationDao;

    //Operação para login
    public String login(LoginDto user) {
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null) {
            BCrypt.Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), userEntity.getPassword());
            if (result.verified) {
                String newAuthenticationToken = generateNewToken();
                TokenEntity tokenEntity = tokenDao.findTokenByUsername(userEntity.getUsername());
                tokenEntity.setAuthenticationToken(newAuthenticationToken);
                tokenEntity.setAuthenticationTokenDate(LocalDateTime.now());
                return newAuthenticationToken;
            }
        }
        return null;
    }

    public boolean logout(TokenDto tokenDto) {
        if (tokenDao.removeAuthenticationToken(tokenDto.getAuthenticationToken())) {
            return true;
        }
        return false;
    }

    public UserDto checkToken(TokenDto tokenDto, TokenType tokenType) {
        try {
            UserEntity userEntity = switch (tokenType) {
                case AUTHENTICATION -> tokenDao.findUserByAuthenticationToken(tokenDto.getAuthenticationToken());
                case ACTIVATION -> tokenDao.findUserByActivationToken(tokenDto.getActivationToken());
                case PASSWORD_CHANGE -> tokenDao.findUserByPasswordChangeToken(tokenDto.getPasswordChangeToken());
            };
            if (userEntity == null) {
                return null;
            }
            //Mudanças - Em vez de converter completamente o userEntity, é apenas enviado o username, o state, e o admin
            UserDto userDto = new UserDto();
            userDto.setUsername(userEntity.getUsername());
            userDto.setState(userEntity.getState());
            userDto.setAdmin(userEntity.getAdmin());
            userDto.setToken(convertTokenEntityToTokenDto(userEntity.getToken(), tokenType));
            return userDto;
            //return userBean.convertUserEntitytoUserDto(userEntity);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    public boolean isTokenExpired(TokenDto tokenDto, TokenType tokenType) {
        try {
            switch (tokenType) {
                case AUTHENTICATION:
                    return LocalDateTime.now().isAfter(getExpirationDate(tokenDto, TokenType.AUTHENTICATION));
                case ACTIVATION:
                    return LocalDateTime.now().isAfter(getExpirationDate(tokenDto, TokenType.ACTIVATION));
                case PASSWORD_CHANGE:
                    return LocalDateTime.now().isAfter(getExpirationDate(tokenDto, TokenType.PASSWORD_CHANGE));
            }
            return true;
        } catch (Exception e) {
            logger.error(e);
            return true;
        }
    }

    public boolean checkIfAuthenticationTokenValid(String authenticationToken) {
        return tokenDao.findIfAuthenticationTokenExists(authenticationToken);
    }


    public String generateNewActivationToken(UserDto userDto) {
        try {
            UserEntity userEntity = userDao.findUserByUsername(userDto.getUsername());
            if (userEntity != null) {
                String newActivationToken = generateNewToken();
                TokenEntity tokenEntity = tokenDao.findTokenByUsername(userEntity.getUsername());
                tokenEntity.setActivationToken(newActivationToken);
                tokenEntity.setActivationTokenDate(LocalDateTime.now());
                return newActivationToken;
            }
            return null;
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    private TokenDto convertTokenEntityToTokenDto(TokenEntity tokenEntity, TokenType tokenType) {
        TokenDto tokenDto = new TokenDto();
        switch (tokenType) {
            case AUTHENTICATION -> {
                tokenDto.setAuthenticationToken(tokenEntity.getAuthenticationToken());
                tokenDto.setAuthenticationTokenDate(tokenEntity.getAuthenticationTokenDate());
            }
            case ACTIVATION -> {
                tokenDto.setActivationToken(tokenEntity.getActivationToken());
                tokenDto.setActivationTokenDate(tokenEntity.getActivationTokenDate());
            }
            case PASSWORD_CHANGE -> {
                tokenDto.setPasswordChangeToken(tokenEntity.getPasswordChangeToken());
                tokenDto.setPasswordChangeTokenDate(tokenEntity.getPasswordChangeTokenDate());
            }
        }
        return tokenDto;
    }

    private LocalDateTime getExpirationDate(TokenDto tokenDto, TokenType tokenType) {
        ConfigurationEntity latestConfiguration = configurationDao.getLatestConfiguration();
        switch (tokenType) {
            case AUTHENTICATION -> {
                return tokenDto.getAuthenticationTokenDate().plusMinutes(latestConfiguration.getAuthenticationExpirationTime());
            }
            case ACTIVATION -> {
                return tokenDto.getActivationTokenDate().plusMinutes(latestConfiguration.getActivationExpirationTime());
            }
            case PASSWORD_CHANGE -> {
                return tokenDto.getPasswordChangeTokenDate().plusMinutes(latestConfiguration.getPasswordChangeExpirationTime());
            }
        }
        return null;
    }


    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom(); //threadsafe
        Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }
}