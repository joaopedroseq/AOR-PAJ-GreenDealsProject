package pt.uc.dei.proj5.beans;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dao.ConfigurationDao;
import pt.uc.dei.proj5.dao.ProductDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.ConfigurationDto;
import pt.uc.dei.proj5.entity.ConfigurationEntity;
import pt.uc.dei.proj5.entity.UserEntity;

import java.time.LocalDateTime;

@Stateless
public class ConfigurationBean {
    private static final Logger logger = LogManager.getLogger(ConfigurationBean.class);

    @Inject
    ConfigurationDao configurationDao;

    @Inject
    UserBean userBean;

    @Inject
    UserDao userDao;



    public ConfigurationBean() {
    }

    public ConfigurationDto getLatestConfiguration() {
        try{
            ConfigurationEntity configurationEntity = configurationDao.getLatestConfiguration();
            ConfigurationDto configurationDto = new ConfigurationDto();
            configurationDto.setAdminUsername(configurationEntity.getUser().getUsername());
            configurationDto.setAuthenticationExpirationTime(configurationEntity.getAuthenticationExpirationTime());
            configurationDto.setActivationExpirationTime(configurationEntity.getActivationExpirationTime());
            configurationDto.setPasswordChangeExpirationTime(configurationEntity.getPasswordChangeExpirationTime());
            configurationDto.setDateOfUpdate(configurationEntity.getDateOfUpdate());
            return configurationDto;
        }
        catch (Exception e) {
            logger.error("Error getting latest expiration configuration");
            return null;
        }
    }

    public boolean createNewConfiguration(ConfigurationDto configurationDto) {
        try{
            ConfigurationEntity newConfiguration = new ConfigurationEntity();
            newConfiguration.setAuthenticationExpirationTime(configurationDto.getAuthenticationExpirationTime());
            newConfiguration.setActivationExpirationTime(configurationDto.getActivationExpirationTime());
            newConfiguration.setPasswordChangeExpirationTime(configurationDto.getPasswordChangeExpirationTime());
            newConfiguration.setDateOfUpdate(LocalDateTime.now());
            UserEntity admin = userDao.findUserByUsername(configurationDto.getAdminUsername());
            newConfiguration.setUser(admin);
            configurationDao.persist(newConfiguration);
            return true;
        }
        catch (Exception e) {
            logger.error("Error setting new configuration by " + configurationDto.getAdminUsername());
            return false;
        }
    }
}
