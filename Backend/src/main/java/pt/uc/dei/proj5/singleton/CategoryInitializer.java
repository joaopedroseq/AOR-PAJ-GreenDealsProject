package pt.uc.dei.proj5.singleton;

import jakarta.ejb.EJB;
import jakarta.ejb.Singleton;
import pt.uc.dei.proj5.dao.CategoryDao;
import pt.uc.dei.proj5.entity.CategoryEntity;

@Singleton
public class CategoryInitializer {
    @EJB
    private CategoryDao categoryDao;

    public void categoryInitializer() {
        if (!categoryDao.findIfCategoryEmptyExists()) {
            CategoryEntity empty = new CategoryEntity();
            empty.setNome("sem categoria");
            empty.setNameEng("empty");
            categoryDao.persist(empty);
        }
    }
}
