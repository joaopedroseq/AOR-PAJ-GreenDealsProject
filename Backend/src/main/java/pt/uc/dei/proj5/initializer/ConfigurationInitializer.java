package pt.uc.dei.proj5.initializer;

import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import pt.uc.dei.proj5.dao.ConfigurationDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.entity.ConfigurationEntity;

import java.time.LocalDateTime;

/**
 * Classe para inicializar configuração
 * @author João Sequeira
 * @version 1.0.0
 * @see DataInitializerSingleton
 */
@Singleton
public class ConfigurationInitializer {
    @EJB
    private ConfigurationDao configurationDao;
    @EJB
    private UserDao userDao;

    /**
     * Metodo para inicializar uma configuração default
     * criado pelo admin com a data atual, com tempos de
     * validade para tokens de autenticação, ativação
     * e mudança de password.
     * Define para todos uma duração de 2880 minutos (48 horas).
     */
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