package pt.uc.dei.proj3.dao;

import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;
import pt.uc.dei.proj3.entity.ProductEntity;

@Stateless
public class ProductDao extends AbstractDao<ProductEntity> {
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
}
