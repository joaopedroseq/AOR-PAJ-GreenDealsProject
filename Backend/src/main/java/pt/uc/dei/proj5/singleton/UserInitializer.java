package pt.uc.dei.proj5.singleton;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import pt.uc.dei.proj5.dao.ConfigurationDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.UserAccountState;
import pt.uc.dei.proj5.entity.TokenEntity;
import pt.uc.dei.proj5.entity.UserEntity;

@Singleton
public class UserInitializer {
    @EJB
    private UserDao userDao;

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
            admin.setExcluded(false);
            admin.setState(UserAccountState.ACTIVE);
            admin.setAdmin(true);
            admin.setUrl("https://icon-icons.com/icons2/508/PNG/512/macintosh_icon-icons.com_49902.png");
            TokenEntity tokenAdmin = new TokenEntity();
            tokenAdmin.setUser(admin);
            admin.setToken(tokenAdmin);
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
            anonymous.setExcluded(false);
            anonymous.setState(UserAccountState.ACTIVE);
            anonymous.setFirstName("anonymous");
            anonymous.setLastName("-");
            anonymous.setPhoneNumber("-1");
            anonymous.setUrl("https://b.thumbs.redditmedia.com/n40D3mkLHMt42LU5vbk23qPKpBT4TeWVcrdNxVoqIvA.png");
            TokenEntity tokenAnonymous = new TokenEntity();
            tokenAnonymous.setUser(anonymous);
            anonymous.setToken(tokenAnonymous);
            userDao.persist(anonymous);
        }
    }
}
