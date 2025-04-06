package pt.uc.dei.proj5.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.entity.ConfigurationEntity;
import pt.uc.dei.proj5.entity.ProductEntity;

@Stateless
public class ConfigurationDao extends AbstractDao<ConfigurationEntity> {
    private static final Logger logger = LogManager.getLogger(CategoryDao.class);
    private static final long serialVersionUID = 1L;

    public ConfigurationDao() {
        super(ConfigurationEntity.class);
    }

    public ConfigurationEntity getLatestConfiguration() {
        try {
            ConfigurationEntity currentConfiguration =  (ConfigurationEntity) em.createNamedQuery("Configuration.getLatestConfiguration").setMaxResults(1).getSingleResult();
            logger.info("Current configuration: " + currentConfiguration);
            return currentConfiguration;
        } catch (NoResultException e) {
            return null;
        }
    }

}
