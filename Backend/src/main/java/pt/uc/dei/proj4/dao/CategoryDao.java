package pt.uc.dei.proj4.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import pt.uc.dei.proj4.entity.CategoryEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;


@Stateless
public class CategoryDao extends AbstractDao<CategoryEntity>{
    private static final Logger logger = LogManager.getLogger(CategoryDao.class);
    private static final long serialVersionUID = 1L;

    public CategoryDao() {
        super(CategoryEntity.class);
    }

    public void flush() {
        em.flush();
    }

    public List<CategoryEntity> getAllCategories() {
        try {
            return (List<CategoryEntity>) em.createNamedQuery("Category.getAllCategories").setParameter("empty", "empty").getResultList();

        } catch (NoResultException e) {
            return null;
        }
    }

    public List<String> getAllCategoriesNamesOnly() {
        try {
            return (List<String>) em.createNamedQuery("Category.getAllCategoriesNames").setParameter("empty", "empty").getResultList();

        } catch (NoResultException e) {
            return null;
        }
    }

    public CategoryEntity findCategoryByName(String categoryName) {
        try {
            return (CategoryEntity) em.createNamedQuery("Category.findCategoryByName").setParameter("nome", categoryName).getSingleResult();

        } catch (NoResultException e) {
            return null;
        }
    }

    public boolean findIfCategoryEmptyExists() {
        TypedQuery<CategoryEntity> query = em.createNamedQuery("Category.findCategoryByName", CategoryEntity.class)
                .setParameter("nome", "empty");
        boolean exists = !query.getResultList().isEmpty();
        logger.info("Empty category exists: " + exists);
        return exists;
    }

    public boolean deleteCategory(CategoryEntity category) {
        try {
            if(em.createNamedQuery("Category.deleteCategory").setParameter("nome", category.getNome()).executeUpdate() > 0){
                return true;
            }
            else {
                return false;
            }
        }
        catch (Exception e) {
            logger.error("Error in deleting category {} in CategoryDao.deleteCategory", category.getNome());
            return false;
        }
    }

}