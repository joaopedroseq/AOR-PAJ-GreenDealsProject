package pt.uc.dei.proj3.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import pt.uc.dei.proj3.entity.UserEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Stateless
public class UserDao extends AbstractDao<UserEntity> {
    private static final Logger logger = LogManager.getLogger(UserDao.class);
    private static final long serialVersionUID = 1L;

    public UserDao() {
        super(UserEntity.class);
    }

    public UserEntity findUserByToken(String token) {
        System.out.println("a iniciar find user");
        try {
            return (UserEntity) em.createNamedQuery("User.findUserByToken").setParameter("token", token)
                    .getSingleResult();

        } catch (NoResultException e) {
            return null;
        }
    }

    public UserEntity findUserByUsername(String username) {
        try {
            return (UserEntity) em.createNamedQuery("User.findUserByUsername").setParameter("username", username)
                    .getSingleResult();

        } catch (NoResultException e) {
            logger.error("Exception {} in UserDao.findUserByUsername", e.getMessage());
            return null;
        }
    }

    public boolean findIfTokenExists(String token) {
        try{
            if (em.createNamedQuery("User.findIfTokenExists").setParameter("token", token).getResultList().isEmpty()) {
                return false;
            }
            else{
                return true;
            }
        }
        catch(NoResultException e){
            logger.error("Exception {} in UserDao.findIfTokenExists", e.getMessage());
            return false;
        }
    }

    public boolean findIfUserExists(String username) {
        try{
            if (em.createNamedQuery("User.findIfUserExists").setParameter("username", username).getResultList().isEmpty()) {
                return false;
            }
            else{
                return true;
            }
        }
        catch(NoResultException e){
            logger.error("Exception {} in UserDao.findIfUserExists", e.getMessage());
            return false;
        }
    }

    public boolean deleteUser(String username) {
        try{
            if (em.createNamedQuery("User.deleteUser").setParameter("username", username).executeUpdate() > 0) {
                return true;
            }
            else{
                return false;
            }
        }
        catch(NoResultException e){
            logger.error("Exception {} in UserDao.deleteUser", e.getMessage());
            return false;
        }
    }

    public boolean excludeUser(String username) {
        try{
            if (em.createNamedQuery("User.excludeUser").setParameter("username", username).executeUpdate() > 0) {
                return true;
            }
            else{
                return false;
            }
        }
        catch(NoResultException e){
            logger.error("Exception {} in UserDao.excludeUser", e.getMessage());
            return false;
        }
    }



}
