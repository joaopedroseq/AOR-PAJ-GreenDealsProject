package pt.uc.dei.proj5.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import pt.uc.dei.proj5.entity.UserEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;

@Stateless
public class UserDao extends AbstractDao<UserEntity> {
    private static final Logger logger = LogManager.getLogger(UserDao.class);
    private static final long serialVersionUID = 1L;

    public UserDao() {
        super(UserEntity.class);
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

    public boolean findIfAnonymousExists(){
        try{
            if (em.createNamedQuery("User.findIfAnonymousExists").setParameter("anonymous", "anonymous").getResultList().isEmpty()) {
                return false;
            }
            else{
                return true;
            }
        }
        catch(NoResultException e){
            logger.error("Exception {} in UserDao.findIfAnonymousExists", e.getMessage());
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
        catch(Exception e){
            logger.error("Exception {} in UserDao.excludeUser", e.getMessage());
            return false;
        }
    }

    public List<UserEntity> getAllUsers() {
        try{
            return em.createNamedQuery("User.getAllUsers").getResultList();
        }
        catch(NoResultException e){
            logger.error("Exception {} in UserDao.getAllUsers", e.getMessage());
            return null;
        }
    }
}