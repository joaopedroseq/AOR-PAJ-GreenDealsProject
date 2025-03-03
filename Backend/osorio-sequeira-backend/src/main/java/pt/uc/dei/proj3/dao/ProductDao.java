package pt.uc.dei.proj3.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import pt.uc.dei.proj3.entity.ProductEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj3.entity.UserEntity;

@Stateless
public class ProductDao extends AbstractDao<ProductEntity> {
    private static final Logger logger = LogManager.getLogger(ProductDao.class);
    private static final long serialVersionUID = 1L;


    public ProductDao() {
        super(ProductEntity.class);
    }

    public ProductEntity getAllProducts() {
        try {
            return (ProductEntity) em.createNamedQuery("Product.getAllProducts")
                    .getResultList();

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

    public void setProductsOfUserToExcluded(String username) {
        try {
            UserEntity userEntity = (UserEntity) em.createNamedQuery("User.findUserByUsername").setParameter("username", username).getSingleResult();
            em.createNamedQuery("Product.setProductsOfUserToExcluded").setParameter("seller", userEntity).executeUpdate();
        } catch (Exception e) {
            logger.error("Exception {} in ProductDao.setProductsOfUserToExcluded", e.getMessage());
        }
    }
}