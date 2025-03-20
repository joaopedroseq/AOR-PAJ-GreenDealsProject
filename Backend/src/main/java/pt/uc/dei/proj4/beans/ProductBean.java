package pt.uc.dei.proj4.beans;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj4.dao.CategoryDao;
import pt.uc.dei.proj4.dao.ProductDao;
import pt.uc.dei.proj4.dao.UserDao;
import pt.uc.dei.proj4.dto.Order;
import pt.uc.dei.proj4.dto.Parameter;
import pt.uc.dei.proj4.dto.ProductDto;
import pt.uc.dei.proj4.dto.StateId;
import pt.uc.dei.proj4.entity.ProductEntity;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Stateless
public class ProductBean {
    private static final Logger logger = LogManager.getLogger(ProductBean.class);

    @EJB
    UserDao userDao;

    @EJB
    CategoryDao categoryDao;

    @EJB
    ProductDao productDao;

    @Inject
    UserBean userBean;

    public ProductBean() {
    }

    public ProductBean (ProductDao productDao) {
        this.productDao = productDao;
    }

    //Novo fetch
    public Set<ProductDto> getProducts(String username, String id, String name, StateId state, Boolean excluded, String category, Boolean edited, Parameter param, Order order) {
        try{
            List<ProductEntity> productEntities = productDao.getFilteredProducts(username, id, name, state, excluded, category, edited, param, order);
            Set<ProductDto> productSet = new LinkedHashSet<>();
            for(ProductEntity productEntity : productEntities){
                ProductDto productDto = convertSingleProductEntitytoProductDto(productEntity);
                productSet.add(productDto);
            }
            for (ProductDto productDto : productSet) {
                System.out.println(productDto);
            }
            return productSet;
        }
        catch(Exception e) {
            logger.error("Error while getting available products");
            logger.error(e);
            return null;
        }
    }

    public ProductDto findProductById(int id) {
        try {
            ProductDto productDto = convertSingleProductEntitytoProductDto(productDao.getProductById(id));
            return productDto;
        } catch (Exception e) {
            return null;
        }
    }

    public boolean buyProduct(ProductDto productDto) {
        try {
            productDao.buyProduct(productDto.getId());
            return true;
        } catch (Exception e) {
            logger.error("Erro ao comprar produto {}", productDto.getId());
            //logger.error(e);
            return false;
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
        produto.setExcluded(productEntity.getExcluded());
        return produto;
    }

    //Method para validar se um Id é um número válido
    public static boolean checkIfValidId(String idString){
        idString = idString.trim();
        if (idString.isEmpty()) {
            return false;
        } else {
            for (int i = 0; i < idString.length(); i++) {
                if(i == 0 && ((idString.charAt(i) != '-') && (!Character.isDigit(idString.charAt(i))))) {
                    return false;
                }
                if (i != 0 && !Character.isDigit(idString.charAt(i))) {
                    return false;
                }
            }
        }
        return true;
    }
}
