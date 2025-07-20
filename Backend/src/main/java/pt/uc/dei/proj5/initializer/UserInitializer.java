package pt.uc.dei.proj5.initializer;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.UserAccountState;
import pt.uc.dei.proj5.entity.TokenEntity;
import pt.uc.dei.proj5.entity.UserEntity;

import java.time.LocalDateTime;

/**
 * Classe para inicializar utilizadores
 * @author João Sequeira
 * @version 1.0.0
 * @see DataInitializerSingleton
 */
@Singleton
public class UserInitializer {
    @EJB
    private UserDao userDao;

    /**
     * Metodo para inicializar dois utilizadores defaults - admin e anonymous -
     * caso estes não existam,
     * o primeiro um utilizador ADMIN e ACTIVE, o último, um utilizador INACTIVE
     */
    public void userInitializer() {
        if (!userDao.findIfUserExists("admin")) {
            UserEntity admin = new UserEntity();
            admin.setUsername("admin");
            String password = "admin";
            password = BCrypt.withDefaults().hashToString(10, password.toCharArray());
            admin.setPassword(password);
            admin.setFirstName("admin");
            admin.setLastName("admin");
            admin.setEmail("admin@admin.com");
            admin.setPhoneNumber("-1");
            admin.setState(UserAccountState.ACTIVE);
            admin.setAdmin(true);

            admin.setRegistrationDate(LocalDateTime.now());
            admin.setActivationDate(LocalDateTime.now());
            userDao.persist(admin);
        }
        if (!userDao.findIfUserExists("anonymous")) {
            UserEntity anonymous = new UserEntity();
            anonymous.setUsername("anonymous");
            String password = "anon";
            password = BCrypt.withDefaults().hashToString(10, password.toCharArray());
            anonymous.setPassword(password);
            anonymous.setAdmin(true);
            anonymous.setEmail("anon@anon");
            anonymous.setState(UserAccountState.INACTIVE);
            anonymous.setFirstName("anonymous");
            anonymous.setLastName("-");
            anonymous.setPhoneNumber("-1");
            anonymous.setRegistrationDate(LocalDateTime.now());
            userDao.persist(anonymous);
        }
    }
}
