package pt.uc.dei.proj5.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import pt.uc.dei.proj5.dto.Order;
import pt.uc.dei.proj5.dto.UserAccountState;
import pt.uc.dei.proj5.dto.UserParameter;
import pt.uc.dei.proj5.entity.UserEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.ArrayList;
import java.util.List;

@Stateless
public class UserDao extends AbstractDao<UserEntity> {
    private static final Logger logger = LogManager.getLogger(UserDao.class);
    private static final long serialVersionUID = 1L;

    public UserDao() {
        super(UserEntity.class);
    }

    public List<UserEntity> getFilteredUsers(String username, String firstName, String lastName, String email, String phone, UserAccountState state, UserParameter parameter, Order order) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<UserEntity> query = cb.createQuery(UserEntity.class);
        Root<UserEntity> root = query.from(UserEntity.class);
        List<Predicate> predicates = new ArrayList<>();
        String param = parameter.toString().toLowerCase();
        if(username != null) {
            Predicate usernameSearchPredicate = cb.or(
                    cb.like(cb.lower(root.get("username")), "%" + username.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("username")), username.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("username")), "%" + username.toLowerCase())
            );
            predicates.add(usernameSearchPredicate);
        }
        predicates.add(cb.notEqual(cb.lower(root.get("username")), "anonymous"));
        if(firstName != null) {
            Predicate firstNameSearchPredicate = cb.or(
                    cb.like(cb.lower(root.get("firstname")), "%" + firstName.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("firstname")), firstName.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("firstname")), "%" + firstName.toLowerCase())
            );
            predicates.add(firstNameSearchPredicate);
        }
        if (lastName != null) {
            Predicate lastNameSearchPredicate = cb.or(
                    cb.like(cb.lower(root.get("lastname")), "%" + lastName.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("lastname")), lastName.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("lastname")), "%" + lastName.toLowerCase())
            );
            predicates.add(lastNameSearchPredicate);
        }
        if(email != null) {
            Predicate emailPredicate = cb.or(
                    cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("email")), email.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase())
            );
            predicates.add(emailPredicate);
        }
        if (phone != null) {
            Predicate phonePredicate = cb.or(
                    cb.like(cb.lower(root.get("phonenumber")), "%" + phone.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("phonenumber")), phone.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("phonenumber")), "%" + phone.toLowerCase())
            );
            predicates.add(phonePredicate);
        }
        if (state == null) {
            predicates.add(cb.equal(root.get("state"), UserAccountState.ACTIVE.toString()));
        }
        else {
            Predicate statePredicate = cb.or(
                    cb.equal(root.get("state"), UserAccountState.ACTIVE.toString()),
                    cb.equal(root.get("state"), UserAccountState.INACTIVE.toString()),
                    cb.equal(root.get("state"), UserAccountState.EXCLUDED.toString()));
            predicates.add(statePredicate);
        }
        query.select(root).where(cb.and(predicates.toArray(new Predicate[0])));
        if(order.equals(Order.asc)) {
            query.orderBy(cb.asc(root.get(param)));
        }
        else if(order.equals(Order.desc)) {
            query.orderBy(cb.desc(root.get(param)));
        }
        return em.createQuery(query).getResultList();
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
        try {
            Long count = (Long) em.createNamedQuery("User.findIfUserExists")
                    .setParameter("username", username)
                    .getSingleResult();

            return count > 0;  // If count is greater than 0, the user exists
        } catch (NoResultException e) {
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
            if (em.createNamedQuery("Token.deleteTokensByUser").setParameter("username", username).executeUpdate() > 0) {
                if (em.createNamedQuery("User.deleteUser").setParameter("username", username).executeUpdate() > 0) {
                    return true;
                }
                else {
                    return false;
                }
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

    public int getNumberOfUsers() {
        try {
            Long count = (Long) em.createNamedQuery("User.getNumberOfUsers").getSingleResult();
            return count.intValue(); // Convert Long to int
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return 0; // Fallback value in case of failure
        }
    }
}