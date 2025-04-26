package pt.uc.dei.proj5.beans;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dao.CategoryDao;
import pt.uc.dei.proj5.dao.ProductDao;
import pt.uc.dei.proj5.dao.UserDao;
import pt.uc.dei.proj5.dto.*;
import pt.uc.dei.proj5.entity.ProductEntity;
import pt.uc.dei.proj5.websocket.wsProducts;

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

    @Inject
    wsProducts wsProducts;

    public ProductBean() {
    }

    //Novo fetch
    public Set<ProductDto> getProducts(String seller, String id, String name, ProductStateId state, Boolean excluded, String category, Boolean edited, ProductParameter param, Order order) {
        try{
            List<ProductEntity> productEntities = productDao.getFilteredProducts(seller, id, name, state, excluded, category, edited, param, order);
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
            //check if the only diference is in product state
            ProductEntity productEntity = productDao.getProductById(productDto.getId());
            if (checkIfOnlyStateChanges(productDto, productEntity)) {
                productEntity.setState(productDto.getState());
                if(productDto.getState()==ProductStateId.BOUGHT){
                    productEntity.setBuyer(userDao.findUserByUsername(productDto.getBuyer()));
                }
                else {
                    productEntity.setBuyer(null);
                }
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
                        if(productDto.getState()==ProductStateId.BOUGHT){
                            productEntity.setBuyer(userDao.findUserByUsername(productDto.getBuyer()));
                        }
                        else {
                            productEntity.setBuyer(null);
                        }
                    }
                }
                if(productDto.isExcluded() != null) {
                    productEntity.setExcluded(productDto.isExcluded());
                }
                productEntity.setEdited(true);
                productEntity.setEditedDate(LocalDateTime.now());
                if (productDto.getBuyer()!= null){
                    productEntity.setBuyer(userDao.findUserByUsername(productDto.getBuyer()));
                }
                return true;
            }
        } catch (Exception e) {
            logger.error("Error updating product {}", productDto.getId());
            return false;
        }
    }

    public ProductDto findProductById(Long id) {
        try {
            ProductDto productDto = convertSingleProductEntitytoProductDto(productDao.getProductById(id));
            return productDto;
        } catch (Exception e) {
            return null;
        }
    }
    public boolean deleteProduct(Long productId) {
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
        produto.setState(productEntity.getState());
        produto.setSeller(productEntity.getSeller().getUsername());
        produto.setCategory(categoryBean.convertCategoryEntityToCategoryDto(productEntity.getCategory()));
        if(productEntity.getBuyer() != null) {
            produto.setBuyer(productEntity.getBuyer().getUsername());
        }
        produto.setUrlImage(productEntity.getUrlImage());
        produto.setEdited(productEntity.getEdited());
        if(productEntity.getEdited()) {
            produto.setEditedDate(productEntity.getEditedDate());
        }
        produto.setExcluded(productEntity.getExcluded());
        return produto;
    }

    public ProductEntity convertSingleProductDtotoProductEntity(ProductDto productDto) {
        ProductEntity product = new ProductEntity();
        product.setSeller(userDao.findUserByUsername(productDto.getSeller()));
        product.setId(productDto.getId());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setName(productDto.getName());
        product.setExcluded(productDto.isExcluded());
        product.setDate(productDto.getDate());
        product.setEdited(productDto.getEdited());
        if(productDto.getEdited()) {
            product.setEditedDate(productDto.getEditedDate());
        }
        product.setLocation(productDto.getLocation());
        product.setState(productDto.getState());
        if(productDto.getBuyer() != null) {
            product.setBuyer(userDao.findUserByUsername(productDto.getBuyer()));
        }
        product.setCategory(categoryBean.convertCategoryDtoToCategoryEntity(productDto.getCategory()));
        product.setUrlImage(productDto.getUrlImage());
        return product;
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

    public boolean checkIfOnlyStateChanges(ProductDto productDto, ProductEntity productEntity) {
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