package pt.uc.dei.proj5.singleton;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.annotation.PostConstruct;
import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.mail.internet.HeaderTokenizer;
import pt.uc.dei.proj5.dao.CategoryDao;
import pt.uc.dei.proj5.dao.ConfigurationDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.UserAccountState;
import pt.uc.dei.proj5.entity.CategoryEntity;
import pt.uc.dei.proj5.entity.ConfigurationEntity;
import pt.uc.dei.proj5.entity.TokenEntity;
import pt.uc.dei.proj5.entity.UserEntity;

import java.time.LocalDateTime;

@Singleton
@Startup
public class DataInitializer {
    @EJB
    private UserInitializer userInitializer;
    @EJB
    private CategoryInitializer categoryInitializer;

    @EJB
    private ConfigurationInitializer configurationInitializer;

    @PostConstruct
    public void init() {
        userInitializer.userInitializer();
        categoryInitializer.categoryInitializer();
        configurationInitializer.configurationInitializer();
    }
}