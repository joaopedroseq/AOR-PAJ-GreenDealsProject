package pt.uc.dei.proj5.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.entity.TokenEntity;
import pt.uc.dei.proj5.entity.UserEntity;

@Stateless
public class TokenDao extends AbstractDao<TokenEntity> {
    private static final Logger logger = LogManager.getLogger(TokenDao.class);
    private static final long serialVersionUID = 1L;

    public TokenDao() {
        super(TokenEntity.class);
    }

    //Authentication Token
    public UserEntity findUserByToken(String token) {
        try {
            UserEntity user = (UserEntity) em.createNamedQuery("Token.findUserByToken").setParameter("token", token)
                    .getSingleResult();
            return user;

        } catch (NoResultException e) {
            logger.error("Exception {} in TokenDao.findUserByAuthenticationToken", e.getMessage());
            return null;
        }
    }

    public TokenEntity findTokenByValue(String tokenValue) {
        try {
            TokenEntity token = (TokenEntity) em.createNamedQuery("Token.findTokenByValue").setParameter("value", tokenValue)
                    .getSingleResult();
            return token;

        } catch (NoResultException e) {
            logger.error("Exception {} in TokenDao.findTokenByValue", e.getMessage());
            return null;
        }
    }

    public boolean revokeToken(String token) {
        try{
            if (em.createNamedQuery("Token.revokeToken").setParameter("token", token).executeUpdate() > 0) {
                return true;
            }
            else{
                return false;
            }
        }
        catch(NoResultException e){
            logger.error("Exception {} in TokenDao.findIfAuthenticationTokenExists", e.getMessage());
            return false;
        }
    }


}