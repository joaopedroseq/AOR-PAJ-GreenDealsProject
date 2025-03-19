package pt.uc.dei.proj4.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import pt.uc.dei.proj4.entity.CategoryEntity;
import pt.uc.dei.proj4.entity.ProductEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj4.entity.UserEntity;

import java.util.ArrayList;
import java.util.List;

@Stateless
public class ProductDao extends AbstractDao<ProductEntity> {
    private static final Logger logger = LogManager.getLogger(ProductDao.class);
    private static final long serialVersionUID = 1L;


    public ProductDao() {
        super(ProductEntity.class);
    }

    public List<ProductEntity> getAllProducts() {
        try {
            return (List<ProductEntity>) em.createNamedQuery("Product.getAllProducts").getResultList();

        } catch (NoResultException e) {
            return null;
        }
    }

    public ProductEntity getProductById(int id) {
        try {
            return (ProductEntity) em.createNamedQuery("Product.getProductById").setParameter("id", id).getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public void buyProduct(int id) {
        try {
            em.createNamedQuery("Product.buyProduct").setParameter("id", id).executeUpdate();
        } catch (NoResultException e) {
            logger.error("Error buying product");
            //logger.error(e);
        }
    }

    public void excludeProduct(int id) {
        try {
            em.createNamedQuery("Product.excludeProduct").setParameter("id", id).executeUpdate();
        } catch (NoResultException e) {
            logger.error("Error excluding product in product dao");
            //logger.error(e);
        }
    }

    public void setProductsOfUserToExcluded(String username) {
        try {
            UserEntity userEntity = (UserEntity) em.createNamedQuery("User.findUserByUsername").setParameter("username", username).getSingleResult();
            em.createNamedQuery("Product.setProductsOfUserToExcluded").setParameter("seller", userEntity).executeUpdate();
        } catch (Exception e) {
            logger.error("Exception {} in ProductDao.setProductsOfUserToExcluded", e.getMessage());
        }
    }

    public void setProductsOfUserToAnonymous(String username) {
        try {
            UserEntity userEntity = (UserEntity) em.createNamedQuery("User.findUserByUsername").setParameter("username", username).getSingleResult();
            UserEntity anonymous = (UserEntity) em.createNamedQuery("User.findUserByUsername").setParameter("username", "anonymous").getSingleResult();
            em.createNamedQuery("Product.setProductsOfUserToAnonymous").setParameter("anonymous", anonymous).setParameter("seller", userEntity).executeUpdate();
        } catch (Exception e) {
            logger.error("Exception {} in ProductDao.setProductsOfUserToAnonymous", e.getMessage());
        }
    }

    public void deleteProductsOfUser(String username) {
        try {
            UserEntity sellerEntity = (UserEntity) em.createNamedQuery("User.findUserByUsername").setParameter("username", username).getSingleResult();
            em.createNamedQuery("Product.deleteProductsOfUser").setParameter("seller", sellerEntity).executeUpdate();
        } catch (Exception e) {
            logger.error("Exception {} in ProductDao.deleteProductsOfUser", e.getMessage());
        }
    }


    public void deleteProduct(int id) {
        try {
            em.createNamedQuery("Product.deleteProduct").setParameter("id", id).executeUpdate();
        } catch (NoResultException e) {
            logger.error("Error deleting product in product dao");
        }
    }

    public List<ProductEntity> getActiveProducts() {
        try {
            return (List<ProductEntity>) em.createNamedQuery("Product.getActiveProducts").getResultList();

        } catch (NoResultException e) {
            return null;
        }
    }

    public List<ProductEntity> getEditedProducts() {
        try {
            return (List<ProductEntity>) em.createNamedQuery("Product.getEditedProducts").getResultList();

        } catch (NoResultException e) {
            return null;
        }
    }

    public List<ProductEntity> getAvailableProducts() {
        try {
            return (List<ProductEntity>) em.createNamedQuery("Product.getAvailableProducts").getResultList();

        } catch (NoResultException e) {
            return null;
        }
    }

    public List<ProductEntity> getActiveProductsByUser(String username) {
        try {
            return (List<ProductEntity>) em.createNamedQuery("Product.getActiveProductsByUser").setParameter("username", username).getResultList();

        } catch (NoResultException e) {
            return null;
        }
    }

    public List<ProductEntity> getAllProductsByUser(String username) {
        try {
            return (List<ProductEntity>) em.createNamedQuery("Product.getAllProductsByUser").setParameter("username", username).getResultList();

        } catch (NoResultException e) {
            return null;
        }
    }

    public List<ProductEntity> getProductsByCategory(String category) {
        try {
            return (List<ProductEntity>) em.createNamedQuery("Product.getProductsByCategory").setParameter("category", category).getResultList();

        } catch (NoResultException e) {
            return null;
        }
    }

    public void setAllProductsCategoryToEmpty(CategoryEntity empty, CategoryEntity categoryEntity) {
        try {
            em.createNamedQuery("Product.setAllProductsCategoryToEmpty").setParameter("empty", empty).setParameter("category", categoryEntity).executeUpdate();
        } catch (NoResultException e) {
            logger.error("Error setting all products category to empty in ProductDao.setAllProductsCategoryToEmpty");
        }
    }

    //Criteria API query's
    public List<ProductEntity> getFilteredProducts(String username, String id, String productName, String state, Boolean excluded, String category) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<ProductEntity> query = cb.createQuery(ProductEntity.class);
        Root<ProductEntity> root = query.from(ProductEntity.class);
        List<Predicate> predicates = new ArrayList<>();
        //Adicionar predicados à query
        if (username != null) {
            predicates.add(cb.equal(root.get("seller").get("username"), username));
        }
        if (id != null) {
            predicates.add(cb.equal(root.get("id"), id));
        }
        if (state != null) {
            predicates.add(cb.equal(root.get("state"), state));
        }
        if (category != null) {
            predicates.add(cb.equal(root.get("category").get("nome"), category));
        }
        if (excluded != null) {
            predicates.add(cb.equal(root.get("excluded"), excluded));
        }
        if (productName != null) {
            Predicate nameSearchPredicate = cb.or(
                    cb.like(cb.lower(root.get("name")), "%" + productName.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("name")), productName.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("name")), "%" + productName.toLowerCase())
            );
            predicates.add(nameSearchPredicate);
        }
        // Combina os predicados para a query - o toArray(new Predicate[0]) transforma o arrayList num array
        query.select(root).where(cb.and(predicates.toArray(new Predicate[0])));
        // Ordenar de mais antigos para mais recentes
        query.orderBy(cb.asc(root.get("date")));
        // executar a query
        return em.createQuery(query).getResultList();
    }
}