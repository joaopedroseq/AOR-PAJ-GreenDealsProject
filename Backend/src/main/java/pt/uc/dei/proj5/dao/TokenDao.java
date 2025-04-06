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
    public UserEntity findUserByAuthenticationToken(String authenticationToken) {
        try {
            return (UserEntity) em.createNamedQuery("Token.findUserByAuthenticationToken").setParameter("token", authenticationToken)
                    .getSingleResult();

        } catch (NoResultException e) {
            logger.error("Exception {} in TokenDao.findUserByAuthenticationToken", e.getMessage());
            return null;
        }
    }


    public TokenEntity findTokenByAuthenticationToken(String authenticationToken) {
        try {
            return (TokenEntity) em.createNamedQuery("Token.findTokenByAuthenticationToken").setParameter("token", authenticationToken)
                    .getSingleResult();

        } catch (NoResultException e) {
            logger.error("Exception {} in TokenDao.findTokenByAuthenticationToken", e.getMessage());
            return null;
        }
    }

    //Talvez para apagar
    public boolean findIfAuthenticationTokenExists(String authenticationToken) {
        try{
            if (em.createNamedQuery("Token.findIfAuthenticationTokenExists").setParameter("token", authenticationToken).getResultList().isEmpty()) {
                return false;
            }
            else{
                return true;
            }
        }
        catch(NoResultException e){
            logger.error("Exception {} in TokenDao.findIfAuthenticationTokenExists", e.getMessage());
            return false;
        }
    }

    public boolean removeAuthenticationToken(String authenticationToken) {
        try{
            if (em.createNamedQuery("Token.removeAuthenticationToken").setParameter("authenticationToken", authenticationToken).executeUpdate() > 0) {
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

    //Activation Token
    public UserEntity findUserByActivationToken(String activationToken) {
        try {
            return (UserEntity) em.createNamedQuery("Token.findUserByActivationToken").setParameter("token", activationToken)
                    .getSingleResult();

        } catch (NoResultException e) {
            logger.error("Exception {} in TokenDao.findUserByAuthenticationToken", e.getMessage());
            return null;
        }
    }


    public TokenEntity findTokenByUsername(String username) {
        try {
            return (TokenEntity) em.createNamedQuery("Token.findTokenByUsername").setParameter("username", username)
                    .getSingleResult();

        } catch (NoResultException e) {
            logger.error("Exception {} in TokenDao.findTokenByUsername", e.getMessage());
            return null;
        }
    }

    //PasswordChangeTOken
    public UserEntity findUserByPasswordChangeToken(String passwordChangeToken) {
        try {
            return (UserEntity) em.createNamedQuery("Token.findUserByPasswordChangeToken").setParameter("token", passwordChangeToken)
                    .getSingleResult();

        } catch (NoResultException e) {
            logger.error("Exception {} in TokenDao.findUserByAuthenticationToken", e.getMessage());
            return null;
        }
    }

}