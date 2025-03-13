package pt.uc.dei.proj4.singleton;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.annotation.PostConstruct;
import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import pt.uc.dei.proj4.dao.CategoryDao;
import pt.uc.dei.proj4.dao.UserDao;
import pt.uc.dei.proj4.entity.CategoryEntity;
import pt.uc.dei.proj4.entity.UserEntity;

@Singleton
@Startup
public class DataInitializer {
    @EJB
    private UserDao userDao;
    @EJB
    private CategoryDao categoryDao;

    @PostConstruct
    public void init() {
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
            admin.setExcluded(false);
            admin.setAdmin(true);
            admin.setUrl("https://b.thumbs.redditmedia.com/n40D3mkLHMt42LU5vbk23qPKpBT4TeWVcrdNxVoqIvA.png");
            userDao.persist(admin);
        }
        if (!categoryDao.findIfCategoryEmptyExists()) {
            CategoryEntity empty = new CategoryEntity();
            empty.setNome("empty");
            categoryDao.persist(empty);
        }
    }
}