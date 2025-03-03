package pt.uc.dei.proj3.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import pt.uc.dei.proj3.entity.ProductEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj3.entity.UserEntity;

import java.util.List;
import java.util.Set;

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
        try{
            em.createNamedQuery("Product.buyProduct").setParameter("id", id);
        }catch(NoResultException e){
            logger.error("Error buying product");
            //logger.error(e);
        }
    }

    public void excludeProduct(int id) {
        try{
            em.createNamedQuery("Product.excludeProduct").setParameter("id", id).executeUpdate();
        }catch(NoResultException e){
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

    public void deleteProduct(int id) {
        try{
            em.createNamedQuery("Product.deleteProduct").setParameter("id", id).executeUpdate();
        }catch(NoResultException e){
            logger.error("Error deleting product in product dao");
            //logger.error(e);
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

}
