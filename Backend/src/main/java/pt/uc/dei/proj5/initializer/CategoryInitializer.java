package pt.uc.dei.proj5.initializer;

import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import pt.uc.dei.proj5.dao.CategoryDao;
import pt.uc.dei.proj5.entity.CategoryEntity;

/**
 * Classe para inicializar categoria
 * @author João Sequeira
 * @version 1.0.0
 * @see DataInitializerSingleton
 */
@Singleton
public class CategoryInitializer {
    @EJB
    private CategoryDao categoryDao;

    /**
     * Metodo para inicializar uma categoria vazia - empty
     * caso esta não exista
     */
    public void categoryInitializer() {
        if (!categoryDao.findIfCategoryEmptyExists()) {
            CategoryEntity empty = new CategoryEntity();
            empty.setNome("semCategoria");
            empty.setNameEng("empty");
            categoryDao.persist(empty);
        }
    }
}
