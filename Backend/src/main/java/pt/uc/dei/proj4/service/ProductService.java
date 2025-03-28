package pt.uc.dei.proj4.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj4.beans.CategoryBean;
import pt.uc.dei.proj4.beans.ProductBean;
import pt.uc.dei.proj4.beans.UserBean;
import pt.uc.dei.proj4.dao.CategoryDao;
import pt.uc.dei.proj4.dto.*;

import java.util.Set;


@Path("/products")
public class ProductService {
    private static final Logger logger = LogManager.getLogger(ProductService.class);

    @Inject
    ProductBean productBean;

    @Inject
    UserBean userbean;

    @Inject
    CategoryBean categoryBean;

    //Active products - Non excluded products, all states
    @GET
    @Path("/active")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getActiveProducts() {
        Set<ProductDto> produtos = userbean.getActiveProducts();
        if (produtos != null) {
            return Response.status(200).entity(produtos).build();
        } else {
            return Response.status(400).entity("Error getting active products").build();
        }
    }

    //Active products - Non excluded products, all states, of a single user
    @GET
    @Path("/active/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getActiveProductsByUser(@HeaderParam("token") String token, @PathParam("username") String pathUsername) {
        UserDto user = userbean.verifyToken(token);
        if (user == null) {
            logger.error("Invalid token - Getting active products by user");
            return Response.status(401).entity("Invalid token").build();
        } else if (!user.getUsername().equals(pathUsername) && !user.getAdmin()) {
            logger.error("Permision denied - {} getting active products of {}", user.getUsername(), pathUsername);
            return Response.status(403).entity("Permission denied").build();
        } else {
            Set<ProductDto> produtos = userbean.getActiveProductsByUser(pathUsername);
            if (produtos != null) {
                return Response.status(200).entity(produtos).build();
            } else {
                return Response.status(400).entity("Error getting all products").build();
            }
        }
    }

    //All products - Excluded products, all states
    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProducts() {
        Set<ProductDto> produtos = userbean.getAllProducts();
        if (produtos != null) {
            return Response.status(200).entity(produtos).build();
        } else {
            return Response.status(400).entity("Error getting all products").build();
        }
    }


    //Deprecated - with new Get
    //Edited products - Excluded products, all states
    @GET
    @Path("/edited")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEditedProducts(@HeaderParam("token") String token) {
        UserDto user = userbean.verifyToken(token);
        if (user == null) {
            logger.error("Invalid token - getting edited products");
            return Response.status(401).entity("Invalid token").build();
        } else if (!user.getAdmin()) {
            logger.error("Permision denied - {} getting edited products", user.getUsername());
            return Response.status(403).entity("Permission denied").build();
        } else {
            Set<ProductDto> produtos = userbean.getEditedProducts();
            if (produtos != null) {
                return Response.status(200).entity(produtos).build();
            } else {
                return Response.status(400).entity("Error getting edited products").build();
            }
        }
    }

    //Available products - Non excluded products, state 2 (DISPONIVEL)
    /*@GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAvailableProducts() {
        Set<ProductDto> produtos = userbean.getAvailableProducts();
        if (produtos != null) {
            return Response.status(200).entity(produtos).build();
        } else {
            return Response.status(400).entity("Error getting available products").build();
        }
    }*/

    //All products by category - non excluded state 2 (DISPONIVEL)
    @GET
    @Path("/{category}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductByCategory(@HeaderParam("token") String token, @PathParam("category") String category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setName(category);
        if (!categoryBean.checkIfCategoryExists(categoryDto)) {
            logger.error("Error - getting products by category {} that doesn't exist", category);
            return Response.status(404).entity("Error getting product by inexistent category").build();
        } else {
            Set<ProductDto> products = categoryBean.getProductsByCategory(category);
            if (products != null) {
                logger.info("getting products by category {} ", category);
                return Response.status(200).entity(products).build();
            } else {
                logger.info("Error - getting products by category {} ", category);
                return Response.status(404).entity("Error getting product by category").build();
            }
        }
    }

    //get all products of a user - even excluded
    @GET
    @Path("/all/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllproductsByUser(@HeaderParam("token") String token, @PathParam("username") String username) {
        UserDto user = userbean.verifyToken(token);
        if (user == null) {
            logger.error("Invalid token - Getting product by category");
            return Response.status(401).entity("Invalid token").build();
        } else if (!user.getAdmin()) {
            logger.error("Permision denied - {} getting all products of user {} ", user.getUsername(), username);
            return Response.status(403).entity("Permission denied").build();
        } else if (!userbean.checkIfUserExists(username)) {
            logger.error("Error - {} getting all products of user {} that doesn't exist", user.getUsername(), user);
            return Response.status(404).entity("Error getting all products of inexistent user").build();
        } else {
            Set<ProductDto> products = userbean.getAllProductsByUser(username);
            if (products != null) {
                logger.info("{} getting all products of user {} ", user.getUsername(), username);
                return Response.status(200).entity(products).build();
            } else {
                logger.info("Error - {} getting all products of user {} ", user.getUsername(), username);
                return Response.status(404).entity("Error getting product by category").build();
            }
        }
    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProducts(@HeaderParam("token") String token,
                                @QueryParam("username") String username,
                                @QueryParam("id") String id,
                                @QueryParam("name") String name,
                                @QueryParam("state") String state,
                                @QueryParam("excluded") Boolean excluded,
                                @QueryParam("category") String category,
                                @QueryParam("edited") @DefaultValue("false") Boolean edited,
                                @QueryParam("parameter") @DefaultValue("date") String param,
                                @QueryParam("order") @DefaultValue("asc") String ordering,
                                @QueryParam("page") @DefaultValue("1") int page,
                                @QueryParam("size") @DefaultValue("10") int size) {
        StateId stateId = null;
        Parameter parameter;
        Order order;
        UserDto user = userbean.verifyToken(token);
        order = resolveOrder(ordering);
        parameter = resolveParameter(param);
        /*if (ordering != null && !ordering.equals("asc")) {
            try {
                order = Order.valueOf(ordering.toLowerCase().trim());
            } catch (IllegalArgumentException e) {
                logger.error("Invalid parameter value: {}", ordering);
                return Response.status(400).entity("Invalid parameter value").build();
            }
        } else {
            order = Order.asc;
        }
        if (param != null && !param.equals("date")) {
            try {
                parameter = Parameter.valueOf(param.toLowerCase().trim());
            } catch (IllegalArgumentException e) {
                logger.error("Invalid parameter value: {}", param);
                return Response.status(400).entity("Invalid parameter value").build();
            }
        } else {
            parameter = Parameter.date;
        }*/

        //se não houver utilizador logged (não existir token) não poderá pesquisar produtos por utilizador, por id,
        // apenas poderá procurar productos DISPONÍVEL, produtos não excluídos e não editados (edited == true)
        if (user == null && (username != null || id != null || (state != null && !state.equals("DISPONIVEL")) || excluded != null || edited)) {
            logger.error("Invalid token - getting products");
            return Response.status(401).entity("Invalid token").build();
        } else if (user == null) {
            Set<ProductDto> products = productBean.getProducts(null, null, name, StateId.DISPONIVEL, false, category, false, parameter, order);
            if (products != null) {
                logger.info("Getting all products for unlogged user");
                return Response.status(200).entity(products).build();
            }
        } else if (id != null && !id.isEmpty()) {
            if (!ProductBean.checkIfValidId(id)) {
                logger.error("Error - {} getting all products of id {} because it's invalid", user.getUsername(), id);
                return Response.status(404).entity("Invalid Product Id").build();
            }
        }
        if (username != null) {
            username = username.trim();
        }
        if (username != null && !user.getAdmin() && !username.equals(user.getUsername())) {
            logger.error("Permision denied - {} getting all products of user {} ", user.getUsername(), username);
            return Response.status(403).entity("Permission denied").build();
        }
        if (username != null && !userbean.checkIfUserExists(username)) {
            logger.error("Error - {} getting all products of user {} that doesn't exist", user.getUsername(), username);
            return Response.status(404).entity("Error getting all products of inexistent user").build();
        }
        if (username != null && !user.getAdmin()) {
            excluded = false;
        }
        if (category != null) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setName(category);
            if (!categoryBean.checkIfCategoryExists(categoryDto)) {
                logger.error("Error - getting products by category {} that doesn't exist", category);
                return Response.status(404).entity("Error getting product by inexistent category").build();
            }
        }
        if (state != null) {
            try {
                stateId = StateId.valueOf(state);
            } catch (IllegalArgumentException e) {
                logger.error("Error - {} getting all products of state {} because it's invalid", user.getUsername(), state);
                return Response.status(400).entity("Invalid State Id").build();
            }
        }
        Set<ProductDto> products = productBean.getProducts(username, id, name, stateId, excluded, category, edited, parameter, order);
        if (products != null) {
            logger.info("{} getting all products of user {} ", user.getUsername(), username);
            return Response.status(200).entity(products).build();
        } else {
            logger.info("Error - {} getting all products of user {} ", user.getUsername(), username);
            return Response.status(404).entity("Error getting product by category").build();
        }
    }

    //Add product to user
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addProduct(@HeaderParam("token") String token, ProductDto newProductDto) {
        UserDto user = userbean.verifyToken(token);
        if (user == null) {
            logger.error("Invalid token - adding new product");
            return Response.status(401).entity("Invalid token").build();
        } else {
            CategoryDto category = new CategoryDto();
            category.setName(newProductDto.getCategory());
            newProductDto.setExcluded(false);
            if (!newProductDto.newProductIsValid()) {
                logger.error("Invalid data - adding new product");
                return Response.status(400).entity("Invalid data").build();
            } else if (!categoryBean.checkIfCategoryExists(category)) {
                logger.error("Category {} does not exist", category.getName());
                return Response.status(404).entity("Category " + category.getName() + " does not exist").build();
            } else if (userbean.addProduct(user, newProductDto)) {
                logger.info("Added new product to {}", user.getUsername());
                return Response.status(200).entity("Added product").build();
            } else {
                logger.info("Error : Product not added by {}", user.getUsername());
                return Response.status(400).entity("Error").build();
            }
        }
    }

    //Update product info from user
    @PATCH
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProduct(@HeaderParam("token") String token, @PathParam("id") int pathProductId, ProductDto productDto) {
        UserDto user = userbean.verifyToken(token);
        if (user == null) {
            logger.error("Invalid token - updateProduct");
            return Response.status(401).entity("Invalid token").build();
        } else {
            ProductDto product = productBean.findProductById(pathProductId);
            boolean isOwner = user.getUsername().equals(product.getSeller());
            if (product == null) {
                logger.error("Updating product - Product with id {} not found", pathProductId);
                return Response.status(404).entity("Product not found").build();
            } else if ((!isOwner) && !user.getAdmin()) {
                logger.error("Permission denied - {} updated  product of other user {} without admin privileges", user.getUsername(), product.getSeller());
                return Response.status(403).entity("Permission denied - updating another user product").build();
            } else if (product.isExcluded() && (!user.getAdmin())) {
                logger.error("Permission denied - {} trying to recuperate product of {} without admin privileges", user.getUsername(), product.getSeller());
                return Response.status(403).entity("Permission denied - recuperate excluded products").build();
            } else if ((productDto.isExcluded() != product.isExcluded()) && (!isOwner && !user.getAdmin())) {
                logger.error("Permission denied - {} changing excluding state of product of {} without admin privileges or not owner", user.getUsername(), product.getSeller());
                return Response.status(403).entity("Permission denied").build();
            } else {
                productDto.setId(product.getId());
                if (productBean.updateProduct(productDto)) {
                    logger.info("{} updated product {}", user.getUsername(), product.getId());
                    return Response.status(200).entity("Updated product").build();
                } else {
                    logger.info("Error : Product with id {} not updated by {}", product.getId(), user.getUsername());
                    return Response.status(400).entity("Error").build();
                }
            }
        }
    }

    @PATCH
    @Path("{ProductId}/buy")
    public Response buyProduct(@HeaderParam("token") String token, @PathParam("ProductId") int pathProductId) {
        UserDto user = userbean.verifyToken(token);
        if (user == null) {
            logger.error("Invalid token - buying product with id: {}", pathProductId);
            return Response.status(401).entity("Invalid token").build();
        } else {
            ProductDto product = productBean.findProductById(pathProductId);
            if (product == null) {
                logger.error("Buying product - Product with id {} not found", pathProductId);
                return Response.status(404).entity("Product with id " + pathProductId + " not found").build();
            } else if (product.getSeller().equals(user.getUsername())) {
                logger.error("Permission denied - {} buying own product with id: {}", user.getUsername(), pathProductId);
                return Response.status(403).entity("Permission denied - buying own product").build();
            } else if (product.getState().equals(StateId.COMPRADO)) {
                logger.error("Permission denied - {} buying already bought product with id: {}", user.getUsername(), pathProductId);
                return Response.status(403).entity("Permission denied - buying already bought product").build();
            } else if (product.isExcluded()) {
                logger.error("Permission denied - {} buying an excluded product with id: {}", user.getUsername(), pathProductId);
                return Response.status(403).entity("Permission denied - buying excluded product").build();
            } else if (productBean.buyProduct(product)) {
                logger.info("Product with id {} bought by {}", pathProductId, user.getUsername());
                return Response.status(200).entity("produto comprado com sucesso").build();
            } else {
                logger.info("Error : Product with id {} not bought by {}", pathProductId, user.getUsername());
                return Response.status(400).entity("Error").build();
            }
        }
    }

    //Deleting products
    @DELETE
    @Path("{id}")
    public Response deleteProduct(@HeaderParam("token") String token, @PathParam("id") int pathProductId) {
        UserDto user = userbean.verifyToken(token);
        if (user == null) {
            logger.error("Invalid token - deleteProduct");
            return Response.status(401).entity("Invalid token").build();
        } else {
            ProductDto product = productBean.findProductById(pathProductId);
            if (product == null) {
                logger.error("Deleting product - Product with id {} not found", pathProductId);
                return Response.status(404).entity("Product not found").build();
            } else if (!user.getAdmin()) {
                logger.error("Permission denied - {} deleting product {} belonging to {}", user.getUsername(), pathProductId, product.getSeller());
                return Response.status(403).entity("Permission denied").build();
            } else if (productBean.deleteProduct(pathProductId)) {
                logger.info("deleting product -  {} deleted Product {} belonging to {}", user.getUsername(), pathProductId, product.getSeller());
                return Response.status(200).entity("Product deleted").build();
            } else {
                logger.error("Error : Product with id {} not deleted by {}", pathProductId, user.getUsername());
                return Response.status(400).entity("Error").build();
            }
        }
    }


    //Methods to check ordering and parameter
    private Order resolveOrder(String ordering) {
        if (ordering == null || ordering.equalsIgnoreCase("asc")) {
            return Order.asc; // Default to "asc" if null
        }
        try {
            return Order.valueOf(ordering.toLowerCase().trim()); // Convert valid value to enum
        } catch (IllegalArgumentException e) {
            logger.error("Invalid parameter value: {}", ordering);
            throw new WebApplicationException(
                    Response.status(400).entity("Invalid parameter value").build()
            );
        }
    }

    private Parameter resolveParameter(String param) {
        if (param == null || param.equalsIgnoreCase("date")) {
            return Parameter.date; // Default to "date" if null
        }
        try {
            return Parameter.valueOf(param.toLowerCase().trim()); // Convert valid value to enum
        } catch (IllegalArgumentException e) {
            logger.error("Invalid parameter value: {}", param);
            throw new WebApplicationException(
                    Response.status(400).entity("Invalid parameter value").build()
            );
        }
    }


}