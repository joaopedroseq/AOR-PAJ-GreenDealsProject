package pt.uc.dei.proj3.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import pt.uc.dei.proj3.entity.ProductEntity;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

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
        try{
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
}
