package pt.uc.dei.proj3.beans;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dao.ProductDao;
import pt.uc.dei.proj3.dao.UserDao;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.StateId;
import pt.uc.dei.proj3.dto.UserDto;
import pt.uc.dei.proj3.dto.Evaluation;
import pt.uc.dei.proj3.dto.EvaluationCounts;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;

import java.io.*;
import java.util.ArrayList;

@Stateless
public class ApplicationBean implements Serializable {
    UserDao userDao;
    ProductDao productDao;
    CategoryDao categoryDao;

    @Inject
    public ApplicationBean(final UserDao userDao, final ProductDao productDao, final CategoryDao categoryDao) {
        this.userDao = userDao;
        this.productDao = productDao;
        this.categoryDao = categoryDao;
    }

    public ApplicationBean() {
    }


    /*
    public boolean addProduct(String username, String seller, String name, String description, double price, String category, String location, String urlImage) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(username)) {
                ProductPojo productPojo = new ProductPojo(userPojo.getUsername(), name, description, price, category, location, urlImage);
                userPojo.addProductPojo(productPojo);
                writeUserIntoJsonFile();
                return true;
            }
        }
        return false;
    }

    public ProductDto getProduct(int id, String username) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(username)) {
                ArrayList<ProductPojo> productPojos = userPojo.getProductPojos();
                for (ProductPojo productPojo : productPojos) {
                    if (productPojo.getId() == id) {
                        return convertProductToProductDto(productPojo);
                    }
                }
            }
        }
        return null;
    }

    //get product para carregar o detail
    public ProductDto getProduct(int id) {
        for (UserPojo userPojo : userPojos) {
            ArrayList<ProductPojo> productPojos = userPojo.getProductPojos();
            for (ProductPojo productPojo : productPojos) {
                if (productPojo.getId() == id) {
                    return convertProductToProductDto(productPojo);
                }
            }
        }
        return null;
    }

    public boolean isUserExist(String username) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(username)) {
                return true;
            }
        }
        return false;
    }

    public boolean userHasProducts(String username) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(username)) {
                if(userPojo.getProductPojos() != null) {
                    return true;
                }
            }
        }
        return false;
    }

    public ArrayList<ProductDto> getProductsUser(String username) {
        ArrayList<ProductDto> clientProducts = new ArrayList<ProductDto>();
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(username)) {
                ArrayList<ProductPojo> productPojos = userPojo.getProductPojos();
                for (ProductPojo productPojo : productPojos) {
                    clientProducts.add(convertProductToProductDto(productPojo));
                }
            }
        }
        return clientProducts;
    }

    public ArrayList<ProductDto> getProductsAllUsers() {
        ArrayList<ProductDto> productDto = new ArrayList<>();
        for (UserPojo userPojo : userPojos) {
            ArrayList<ProductPojo> productPojos = userPojo.getProductPojos();
            if (productPojos != null) {
                for (ProductPojo productPojo : productPojos) {
                    if (productPojo.getState() == StateId.DISPONIVEL) {
                        productDto.add(convertProductToProductDto(productPojo));
                    }
                }
            }
        }
        return productDto;
    }

    public boolean updateProduct(ProductDto product, String username) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(username)) {
                ProductPojo productPojo = convertProductDtoToProduct(product);
                if (userPojo.updateProductPojo(productPojo)) {
                    writeUserIntoJsonFile();
                    return true;
                }
            }
        }
        return false;
    }

    public boolean buyProduct(int id){
        for (UserPojo userPojo : userPojos) {
            for (ProductPojo productPojo : userPojo.getProductPojos()) {
                if(productPojo.getId() == id){
                    productPojo.setState(StateId.COMPRADO);
                    return true;
                }
            }
        }
        return false;
    }

    public boolean deleteProduct(int id, String username) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(username)) {
                ArrayList<ProductPojo> productPojos = userPojo.getProductPojos();
                for (ProductPojo productPojo : productPojos) {
                    if (productPojo.getId() == id) {
                        if (userPojo.deleteProductPojo(productPojo)) {
                            writeUserIntoJsonFile();
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }
        }
        return false;
    }

    //USERS
    public void addUser(UserPojo a) {
        userPojos.add(a);
        writeUserIntoJsonFile();
    }

    public UserPojo getUser(String username) {
        for (UserPojo u : userPojos) {
            if (u.getUsername().equals(username))
                return u;
        }
        return null;
    }

    public UserDto getUserDto(String username) {
        ArrayList <ProductDto> productDtos= new ArrayList<ProductDto>();
        for (UserPojo u : userPojos) {
            if (u.getUsername().equals(username)) {
                if (u.getProductPojos() != null) {
                    for (ProductPojo productPojo : u.getProductPojos()) {
                        productDtos.add(convertProductToProductDto(productPojo));
                    }
                }
                UserDto toGetUserInfo = new UserDto(u.getFirstName(), u.getLastName(), u.getUsername(), u.getPassword(), u.getEmail(), u.getPhoneNumber(), u.getUrl(), productDtos, u.getEvaluations(), u.getEvaluationCounts());
                return toGetUserInfo;
            }
        }
        return null;
    }

    public UserPojo getLogin(String username, String password) {
        for (int i = 0; i < userPojos.size(); i++) {
            if (userPojos.get(i).getUsername().equals(username) && userPojos.get(i).getPassword().equals(password)) {
                return userPojos.get(i);
            }
        }
        return null;
    }

    public boolean updateUser(String username, UserPojo userPojo) {
        for (UserPojo a : userPojos) {
            if (a.getUsername().equals(username)) {
                a.setFirstName(userPojo.getFirstName());
                a.setLastName(userPojo.getLastName());
                a.setEmail(userPojo.getEmail());
                a.setPassword(userPojo.getPassword());
                a.setPhoneNumber(userPojo.getPhoneNumber());
                a.setUrl(userPojo.getUrl());
                writeUserIntoJsonFile();
                return true;
            }

        }
        return false;
    }


    public void writeUserIntoJsonFile() {
        Jsonb jsonb = JsonbBuilder.create(new JsonbConfig().withFormatting(true));
        try {
            jsonb.toJson(userPojos, new FileOutputStream(fileUsers));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public ArrayList<UserPojo> getUsers() {
        for (UserPojo userPojo : this.userPojos) {
            System.out.println(userPojo.getUsername());
        }
        return userPojos;
    }

    public ProductDto convertProductToProductDto(ProductPojo productPojo) {
        ProductDto productDto = new ProductDto(productPojo.getSeller(), productPojo.getName(), productPojo.getDescription(), productPojo.getPrice(), productPojo.getCategory(), productPojo.getLocation(), productPojo.getUrlImage(), productPojo.getState(), productPojo.getDate(), productPojo.getId());
        return productDto;
    }

    public ProductPojo convertProductDtoToProduct(ProductDto productDto) {
        ProductPojo productPojo = new ProductPojo(productDto.getSeller(), productDto.getName(), productDto.getDescription(), productDto.getPrice(), productDto.getCategory(), productDto.getLocation(), productDto.getUrlImage(), productDto.getState(), productDto.getDate(), productDto.getId());
        return productPojo;
    }

    //Evaluations

    public boolean addEvaluation( Evaluation evaluation) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(evaluation.getSeller())) {
                if (userPojo.addEvaluationUserPojo(evaluation)) {
                    writeUserIntoJsonFile();
                    return true;
                }
            }
        }
        return false;
    }

    public ArrayList<Evaluation> getAllEvaluations(String username) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(username)) {
                return userPojo.getEvaluations();
            }
        }
        return null;
    }

    public EvaluationCounts getEvaluationCounts(String username) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(username)) {
                return userPojo.getEvaluationCounts();
            }
        }
        return null;
    }

    public Evaluation getEvaluationById(String seller, int id) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(seller)) {
                Evaluation toEdit=userPojo.getEvaluation(id);
                return toEdit;
            }
        }
        return null;
    }

    public boolean updateEvaluation(int id,String seller, Evaluation evaluation) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(seller)) {
                userPojo.updateEvaluation(id, evaluation);
                writeUserIntoJsonFile();
                return true;
            }
        }
        return false;
    }

    public boolean deleteEvaluation (int id, String seller) {
        for (UserPojo userPojo : userPojos) {
            if (userPojo.getUsername().equals(seller)) {
                userPojo.deleteEvaluation(id);
                writeUserIntoJsonFile();
                return true;
            }
        }
        return false;
    }
    */
}
