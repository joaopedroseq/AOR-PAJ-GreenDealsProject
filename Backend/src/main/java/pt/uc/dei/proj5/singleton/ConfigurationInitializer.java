package pt.uc.dei.proj5.singleton;

import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;
import jakarta.ejb.Stateless;
import pt.uc.dei.proj5.dao.CategoryDao;
import pt.uc.dei.proj5.dao.ConfigurationDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.entity.ConfigurationEntity;
import java.time.LocalDateTime;

@Singleton
public class ConfigurationInitializer {
    @EJB
    private ConfigurationDao configurationDao;
    @EJB
    private UserDao userDao;

    public void configurationInitializer() {
        if(configurationDao.getLatestConfiguration() == null) {
            ConfigurationEntity newConfiguration = new ConfigurationEntity();
            //default são 48 horas - 2880 minutos
            newConfiguration.setAuthenticationExpirationTime(2880);
            newConfiguration.setActivationExpirationTime(2880);
            newConfiguration.setPasswordChangeExpirationTime(2880);
            newConfiguration.setUser(userDao.findUserByUsername("admin"));
            newConfiguration.setDateOfUpdate(LocalDateTime.now());
            configurationDao.persist(newConfiguration);
        }
    }
}