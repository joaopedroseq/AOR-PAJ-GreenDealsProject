package pt.uc.dei.proj5.initializer;
import jakarta.annotation.PostConstruct;
import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import jakarta.ejb.Startup;

/**
 * Singleton inicializado aquando do arranque do servidor
 * @author João Sequeira
 * @version 1.0.0
 * @see DataInitializerSingleton
 */
@Singleton
@Startup
public class DataInitializerSingleton {
    @EJB
    private UserInitializer userInitializer;
    @EJB
    private CategoryInitializer categoryInitializer;
    @EJB
    private ConfigurationInitializer configurationInitializer;

    /**
     * Metodo que chama que chama os processos
     * <b>userInitializer</b>,
     * <b>categoryInitializer</b> e
     * <b>configurationInitializer</b>
     * para construir configurações iniciais
     */
    @PostConstruct
    public void init() {
        userInitializer.userInitializer();
        categoryInitializer.categoryInitializer();
        configurationInitializer.configurationInitializer();
    }
}