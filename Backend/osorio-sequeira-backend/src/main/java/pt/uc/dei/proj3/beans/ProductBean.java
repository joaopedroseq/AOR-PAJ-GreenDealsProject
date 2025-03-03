package pt.uc.dei.proj3.beans;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dao.ProductDao;
import pt.uc.dei.proj3.dao.UserDao;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.StateId;
import pt.uc.dei.proj3.entity.ProductEntity;

@Stateless
public class ProductBean {
    private static final Logger logger = LogManager.getLogger(ProductBean.class);

    @EJB
    UserDao userDao;

    @EJB
    CategoryDao categoryDao;

    @EJB
    ProductDao productDao;

    public ProductBean() {
    }

    public ProductDto findProductById(int id) {
        try {
            ProductDto productDto = convertSingleProductEntitytoProductDto(productDao.getProductById(id));
            return productDto;
        } catch (Exception e) {
            return null;
        }
    }

    public ProductDto convertSingleProductEntitytoProductDto(ProductEntity productEntity) {
        ProductDto produto = new ProductDto();
        produto.setId(productEntity.getId());
        produto.setDescription(productEntity.getDescription());
        produto.setPrice(productEntity.getPrice());
        produto.setName(productEntity.getName());
        produto.setDate(productEntity.getDate());
        produto.setLocation(productEntity.getLocation());
        StateId state = StateId.RASCUNHO;
        produto.setState(state.stateIdFromInt(productEntity.getState()));
        produto.setSeller(productEntity.getSeller().getUsername());
        produto.setCategory(productEntity.getCategory().getNome());
        produto.setUrlImage(productEntity.getUrlImage());
        return produto;
    }

    public boolean buyProduct(ProductDto productDto) {
        try {
            ProductEntity productEntity = productDao.getProductById(productDto.getId());
            productEntity.setState(4);
            return true;
        } catch (Exception e) {
            logger.error("Erro ao comprar produto {}", productDto.getId());
            //logger.error(e);
            return false;
        }
    }
}
