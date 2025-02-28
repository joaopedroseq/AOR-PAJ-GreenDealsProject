package pt.uc.dei.proj3.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.NoResultException;
import pt.uc.dei.proj3.entity.CategoryEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj3.entity.UserEntity;

import java.util.List;
import java.util.Set;

import pt.uc.dei.proj3.entity.CategoryEntity;

@Stateless
public class CategoryDao extends AbstractDao<CategoryEntity> {
    private static final Logger logger = LogManager.getLogger(CategoryDao.class);
    private static final long serialVersionUID = 1L;

    public CategoryDao() {
        super(CategoryEntity.class);
    }

    public List<CategoryEntity> getAllCategories() {
        try {
            return (List<CategoryEntity>) em.createNamedQuery("Category.getAllCategories").getResultList();

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


}
