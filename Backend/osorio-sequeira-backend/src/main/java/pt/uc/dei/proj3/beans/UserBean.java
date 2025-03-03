package pt.uc.dei.proj3.beans;

import java.io.Serializable;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;
import at.favre.lib.crypto.bcrypt.BCrypt;

//import java.util.logging.Logger;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dao.ProductDao;
import pt.uc.dei.proj3.dao.UserDao;
import pt.uc.dei.proj3.dto.LoginDto;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.StateId;
import pt.uc.dei.proj3.dto.UserDto;
import pt.uc.dei.proj3.entity.ProductEntity;
import pt.uc.dei.proj3.entity.UserEntity;

@Stateless
public class UserBean implements Serializable {

    private static final Logger logger = LogManager.getLogger(UserBean.class);
    @Inject
    ApplicationBean applicationBean;

    @EJB
    UserDao userDao;

    @EJB
    CategoryDao categoryDao;

    @EJB
    ProductDao productDao;

    public UserBean() {
    }

    public boolean registerNormalUser(UserDto userDto) {
        UserEntity user = userDao.findUserByUsername(userDto.getUsername());
        if (user==null){
            UserEntity newUserEntity= convertUserDtotoUserEntity(userDto);
            userDao.persist(newUserEntity);
            return true;
        }else
            return false;
    }

    public boolean registerAdmin(UserDto userDto) {
        UserEntity user = userDao.findUserByUsername(userDto.getUsername());
        if (user==null){
            UserEntity newUserEntity= convertUserDtotoUserEntity(userDto);
            newUserEntity.setAdmin(true);
            userDao.persist(newUserEntity);
            return true;
        }else
            return false;
    }


    public String login(LoginDto user){
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null){
            BCrypt.Result result = BCrypt.verifyer().verify(user.getPassword().toCharArray(), userEntity.getPassword());
            if(result.verified){
                String token = generateNewToken();
                userEntity.setToken(token);
                return token;
            }
        }
        return null;
    }

    public boolean logout(String token) {
        UserEntity u= userDao.findUserByToken(token);
        if(u!=null){
            u.setToken(null);
            return true;
        }
        return false;
    }

    public UserDto verifyToken(String token) {
        try {
            System.out.println("Verifying token");
            return convertUserEntitytoUserDto(userDao.findUserByToken(token));
        }catch (Exception e){
            logger.error(e);
            return null;
        }
    }

    public boolean addProduct(UserDto userDto, ProductDto newProductDto) {
        try {
            System.out.println("Adding new product");
            ProductDto completeProductDto = new ProductDto(newProductDto);
            System.out.println("newProductDto: " + newProductDto);
            System.out.println("completeProductDto: " + completeProductDto);
            ProductEntity product = convertSingleProductDtotoProductEntity(completeProductDto);
            System.out.println("productEntity: " + product);
            productDao.persist(product);
            return true;
        }catch (Exception e){
            logger.error("Error while adding product to user {}",userDto.getUsername(), e);
            return false;
        }
    }



    public UserDto getUserLogged(String token){
        UserEntity u= userDao.findUserByToken(token);
        if(u!=null){

        }
        else {
            return null;
        }
        return null;
    }


    //Converts
    private UserEntity convertUserDtotoUserEntity(UserDto user){
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setPassword(user.getPassword());
        userEntity.setFirstName(user.getFirstName());
        userEntity.setLastName(user.getLastName());
        userEntity.setEmail(user.getEmail());
        userEntity.setPhoneNumber(user.getPhoneNumber());
        userEntity.setUrl(user.getUrl());
        userEntity.setAdmin(false);
        userEntity.setExcluded(false);
        return userEntity;
    }

    private UserDto convertUserEntitytoUserDto(UserEntity user){
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setPassword(user.getPassword());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setUrl(user.getUrl());
        userDto.setAdmin(user.getAdmin());
        userDto.setExcluded(user.getExcluded());
        userDto.setProducts(convertGroupProductEntityToGroupProductDto(user.getProducts()));
      //userDto.setEvaluationsReceived(user.getEvaluationsReceived());
        return userDto;
    }

    public Set<ProductDto> convertGroupProductEntityToGroupProductDto(Set<ProductEntity> products) {
        Set<ProductDto> productDtos = new HashSet<>();
        for (ProductEntity productEntity : products) {
            ProductDto produto = convertSingleProductEntitytoProductDto(productEntity);
            productDtos.add(produto);
        }
        return productDtos;
    }

    public ProductEntity convertSingleProductDtotoProductEntity(ProductDto productDto){
        ProductEntity product = new ProductEntity();
        product.setId(productDto.getId());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setName(productDto.getName());
        product.setExcluded(productDto.isExcluded());
        product.setDate(productDto.getDate());
        product.setEditedDate(productDto.getEdited());
        product.setLocation(productDto.getLocation());
        StateId state = StateId.RASCUNHO;
        int stateInt = state.intFromStateId(productDto.getState());
        product.setState( stateInt);
        System.out.println("convertPEntity from pdto");
        product.setSeller(userDao.findUserByUsername(productDto.getSeller()));
        System.out.println("seller da base de dados: "+product.getSeller());

        product.setCategory(categoryDao.findCategoryByName(productDto.getCategory()));
        System.out.println("category da base de dados: "+product.getCategory());
        product.setUrlImage(productDto.getUrlImage());
        System.out.println("productEntity: " + product);
        return product;
    }

    public ProductDto convertSingleProductEntitytoProductDto(ProductEntity productEntity){
        ProductDto produto = new ProductDto();
        produto.setId(productEntity.getId());
        produto.setDescription(productEntity.getDescription());
        produto.setPrice(productEntity.getPrice());
        produto.setName(productEntity.getName());
        produto.setDate(productEntity.getDate());
        produto.setLocation(productEntity.getLocation());
        StateId state = null;
        produto.setState( state.stateIdFromInt(productEntity.getState()));
        produto.setSeller(productEntity.getSeller().getUsername());
        produto.setCategory(productEntity.getCategory().getNome());
        produto.setUrlImage(productEntity.getUrlImage());
        return produto;
    }

    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom(); //threadsafe
        Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

}