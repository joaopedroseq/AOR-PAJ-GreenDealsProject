package pt.uc.dei.proj5.beans;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dao.CategoryDao;
import pt.uc.dei.proj5.dao.ProductDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.Order;
import pt.uc.dei.proj5.dto.ProductParameter;
import pt.uc.dei.proj5.dto.ProductDto;
import pt.uc.dei.proj5.dto.ProductStateId;
import pt.uc.dei.proj5.entity.ProductEntity;

import java.time.LocalDateTime;
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

    @Inject
    CategoryBean categoryBean;

    public ProductBean() {
    }

    //Novo fetch
    public Set<ProductDto> getProducts(String username, String id, String name, ProductStateId state, Boolean excluded, String category, Boolean edited, ProductParameter param, Order order) {
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
            return null;
        }
    }

    public boolean updateProduct(ProductDto productDto) {
        try {
            System.out.println("updating product.\nproduct: " + productDto);
            //check if the only diference is in product state
            ProductEntity productEntity = productDao.getProductById(productDto.getId());
            if (checkIfOnlyStateChanges(productDto, productEntity)) {
                productEntity.setState(productDto.getState());
                return true;
            } else {
                if (productDto.getName() != null) {
                    productEntity.setName(productDto.getName());
                }
                if (productDto.getDescription() != null) {
                    productEntity.setDescription(productDto.getDescription());
                }
                if (productDto.getPrice() != 0) {
                    productEntity.setPrice(productDto.getPrice());
                }
                if (productDto.getCategory() != null) {
                    productEntity.setCategory(categoryDao.findCategoryByName(productDto.getCategory().getNome()));
                }
                if (productDto.getLocation() != null) {
                    productEntity.setLocation(productDto.getLocation());
                }
                if (productDto.getUrlImage() != null) {
                    productEntity.setUrlImage(productDto.getUrlImage());
                }
                if ((productDto.getState() != null)) {
                    if(productDto.getState() != productEntity.getState()) {
                        productEntity.setState(productDto.getState());
                    }
                }
                if(productDto.isExcluded() != null) {
                    productEntity.setExcluded(productDto.isExcluded());
                }
                productEntity.setEditedDate(LocalDateTime.now());
                return true;
            }
        } catch (Exception e) {
            logger.error("Error updating product {}", productDto.getId());
            logger.error(e);
            return false;
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

    public boolean deleteProduct(int productId) {
        try {
            productDao.deleteProduct(productId);
            return true;
        } catch (Exception e) {
            logger.error("Error while deleting product {}", productId);
            logger.error(e);
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
        ProductStateId state = ProductStateId.RASCUNHO;
        produto.setState(productEntity.getState());
        produto.setSeller(productEntity.getSeller().getUsername());
        produto.setCategory(categoryBean.convertCategoryEntityToCategoryDto(productEntity.getCategory()));
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

    private boolean checkIfOnlyStateChanges(ProductDto productDto, ProductEntity productEntity) {
        if((productDto.getName() == null) || (productDto.getName().equals(productEntity.getName()))) {
            if ((productDto.getDescription() == null) || (productDto.getDescription().equals(productEntity.getDescription()))) {
                if ((productDto.getPrice() == 0) || ((productDto.getPrice() == productEntity.getPrice()) || (productDto.getPrice() == 0))) {
                    if ((productDto.getCategory() == null) || (productDto.getCategory().equals(productEntity.getCategory().getNome()))) {
                        if ((productDto.getLocation() == null) || (productDto.getLocation().equals(productEntity.getLocation()))) {
                            if ((productDto.getUrlImage() == null) || (productDto.getUrlImage().equals(productEntity.getUrlImage()))) {
                                if ((productDto.getState() != null)) {
                                    if (!productDto.getState().equals(productEntity.getState())) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
}