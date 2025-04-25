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

    @EJB
    UserBean userBean;

    //Operação para login
    public String login(LoginDto user) {
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null) {
            BCrypt.Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), userEntity.getPassword());
            if (result.verified) {
                String newAuthenticationToken = generateNewToken();
                TokenEntity tokenEntity = new TokenEntity();
                tokenEntity.setTokenValue(newAuthenticationToken);
                tokenEntity.setTokenType(TokenType.AUTHENTICATION);
                tokenEntity.setUser(userEntity);
                tokenEntity.setDate(LocalDateTime.now());
                tokenEntity.setRevoked(false);
                tokenDao.persist(tokenEntity);
                return newAuthenticationToken;
            }
        }
        return null;
    }

    public boolean logout(TokenDto tokenDto) {
        if (tokenDao.revokeToken(tokenDto.getTokenValue())) {
            return true;
        }
        return false;
    }

    public TokenDto getTokenByValue(String tokenValue) {
        try {
            TokenEntity tokenEntity = tokenDao.findTokenByValue(tokenValue);
            TokenDto tokenDto = new TokenDto();
            tokenDto.setTokenValue(tokenEntity.getTokenValue());
            tokenDto.setTokenType(tokenEntity.getTokenType());
            tokenDto.setCreatedAt(tokenEntity.getDate());
            tokenDto.setUsername(tokenEntity.getUser().getUsername());
            return tokenDto;
        }
        catch (NullPointerException e) {
            logger.error("NullPointerException in TokenDao.findTokenByValue");
            return null;
        }
    }

    public UserDto checkToken(TokenDto tokenDto) {
        try {
            UserEntity userEntity = tokenDao.findUserByToken(tokenDto.getTokenValue());
            if (userEntity == null) {
                return null;
            }
            //Mudanças - Em vez de converter completamente o userEntity, é apenas enviado o username, o state, e o admin
            UserDto userDto = userBean.convertUserEntitytoUserDto(userEntity);
            return userDto;
            //return userBean.convertUserEntitytoUserDto(userEntity);
        } catch (Exception e) {
            logger.error(e);
            return null;
        }
    }

    public boolean isTokenExpired(TokenDto tokenDto, TokenType tokenType) {
        try {
            LocalDateTime expirationDate = getExpirationDate(tokenDto, tokenType);

            if (expirationDate == null) {
                logger.error("Expiration date is null for token type: " + tokenType);
                return false;
            }

            boolean isExpired = LocalDateTime.now().isAfter(expirationDate);

            if (isExpired) {
                revokeToken(tokenDto);
            }

            return isExpired;
        } catch (Exception e) {
            logger.error("Error checking token expiration: ", e);
            return false;
        }
    }

    public void revokeToken (TokenDto tokenDto) {
        tokenDao.revokeToken(tokenDto.getTokenValue());
    }

    private LocalDateTime getExpirationDate(TokenDto tokenDto, TokenType tokenType) {
        ConfigurationEntity latestConfiguration = configurationDao.getLatestConfiguration();
        switch (tokenType) {
            case AUTHENTICATION -> {
                return tokenDto.getCreatedAt().plusMinutes(latestConfiguration.getAuthenticationExpirationTime());
            }
            case ACTIVATION -> {
                return tokenDto.getCreatedAt().plusMinutes(latestConfiguration.getActivationExpirationTime());
            }
            case PASSWORD_RESET -> {
                return tokenDto.getCreatedAt().plusMinutes(latestConfiguration.getPasswordChangeExpirationTime());
            }
        }
        return null;
    }

    public String generateNewActivationToken(UserDto userDto){
        UserEntity userEntity = userDao.findUserByUsername(userDto.getUsername());
        String newActivationToken = generateNewToken();
        TokenEntity tokenEntity = new TokenEntity();
        tokenEntity.setUser(userEntity);
        tokenEntity.setTokenValue(newActivationToken);
        tokenEntity.setTokenType(TokenType.ACTIVATION);
        tokenEntity.setDate(LocalDateTime.now());
        tokenEntity.setRevoked(false);
        tokenDao.persist(tokenEntity);
        return newActivationToken;
    }


    public String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom(); //threadsafe
        Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }
}