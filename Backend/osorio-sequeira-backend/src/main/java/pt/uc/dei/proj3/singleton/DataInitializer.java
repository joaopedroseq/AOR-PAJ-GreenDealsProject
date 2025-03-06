package pt.uc.dei.proj3.singleton;

import jakarta.annotation.PostConstruct;
import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import pt.uc.dei.proj3.dao.UserDao;
import pt.uc.dei.proj3.entity.UserEntity;

@Singleton
@Startup
public class DataInitializer {
    @EJB
    private UserDao userDao;

    @PostConstruct
    public void init() {
        if (!userDao.findIfUserExists("admin")) {
            UserEntity admin = new UserEntity();
            admin.setUsername("admin");
            admin.setPassword("admin");
            admin.setFirstName("admin");
            admin.setLastName("admin");
            admin.setEmail("admin@admin.com");
            admin.setPhoneNumber("-1");
            admin.setExcluded(false);
            admin.setAdmin(true);
            admin.setUrl("-");
            userDao.persist(admin);
        }
    }
}