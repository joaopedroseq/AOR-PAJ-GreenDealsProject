package pt.uc.dei.proj5.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.*;
import pt.uc.dei.proj5.dto.*;
import pt.uc.dei.proj5.websocket.wsProducts;

import java.util.Set;


@Path("/products")
public class ProductService {
    private static final Logger logger = LogManager.getLogger(ProductService.class);

    @Inject
    ProductBean productBean;

    @Inject
    UserBean userbean;

    @Inject
    AuthenticationService authenticationService;

    @Inject
    CategoryBean categoryBean;

    @Inject
    TokenBean tokenBean;

    @Inject
    NotificationBean notificationBean;

    @Inject
    wsProducts wsProducts;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProducts(@HeaderParam("token") String authenticationToken,
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
        ProductStateId productStateId = null;
        ProductParameter parameter;
        Order order;
        UserDto user = null;
        if (authenticationToken != null) {
            try {
                user = authenticationService.validateAuthenticationToken(authenticationToken);
            } catch (WebApplicationException e) {
                return e.getResponse();
            }
        }
        //Caso o request é para um produto especifico (tem um id)
        if (id != null && !id.isEmpty()) {
            if (!ProductBean.checkIfValidId(id)) {
                logger.error("Error - {} getting all products of id {} because it's invalid", user.getUsername(), id);
                return Response.status(404).entity("Invalid Product Id").build();
            } else {
                ProductDto product = productBean.findProductById(Long.parseLong(id));
                if (product.getState() == ProductStateId.DRAFT) {
                    if ((product.getSeller() != user.getUsername()) && !user.getAdmin()) {
                        logger.info("Forbidden getting a draft");
                        return Response.status(403).entity("Permission denied").build();
                    }
                }
                if (product != null) {
                    logger.info("Getting specific product");
                    return Response.status(200).entity(product).build();
                }
            }
        }
        order = resolveOrder(ordering);
        parameter = resolveParameter(param);
        //se não houver utilizador logged (não existir token) não poderá pesquisar produtos por utilizador, por id,
        // apenas poderá procurar productos DISPONÍVEL, produtos não excluídos e não editados (edited == true)
        if (user == null && (username != null || edited)) {
            logger.error("Invalid token - getting products");
            return Response.status(401).entity("Invalid token").build();
        } else if (user == null) {
            Set<ProductDto> products = productBean.getProducts(null, id, name, null, false, category, false, parameter, order);
            if (products != null) {
                logger.info("Getting all products for unlogged user");
                return Response.status(200).entity(products).build();
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
        if (username != null || !user.getAdmin()) {
            excluded = false;
        }
        if (category != null) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setNome(category);
            if (!categoryBean.checkIfCategoryExists(categoryDto)) {
                logger.error("Error - getting products by category {} that doesn't exist", category);
                return Response.status(404).entity("Error getting product by inexistent category").build();
            }
        }
        if (state != null) {
            try {
                productStateId = ProductStateId.valueOf(state);
            } catch (IllegalArgumentException e) {
                logger.error("Error - {} getting all products of state {} because it's invalid", user.getUsername(), state);
                return Response.status(400).entity("Invalid State Id").build();
            }
        }
        Set<ProductDto> products = productBean.getProducts(username, id, name, productStateId, excluded, category, edited, parameter, order);
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
    public Response addProduct(@HeaderParam("token") String authenticationToken, ProductDto newProductDto) {
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
        }
        if (newProductDto.getCategory() == null) {
            logger.error("Invalid data - adding new product");
            return Response.status(400).entity("Invalid data").build();
        }
        CategoryDto category = categoryBean.getCategoryDto(newProductDto.getCategory().getNome());
        newProductDto.setCategory(category);
        newProductDto.setExcluded(false);
        newProductDto.setSeller(user.getUsername());
        if (!newProductDto.newProductIsValid()) {
            logger.error("Invalid data - adding new product");
            return Response.status(400).entity("Invalid data").build();
        } else if (!categoryBean.checkIfCategoryExists(category)) {
            logger.error("Category {} does not exist", category.getNome());
            return Response.status(404).entity("Category " + category.getNome() + " does not exist").build();
        } else if (userbean.addProduct(user, newProductDto)) {
            logger.info("Added new product to {}", user.getUsername());
            return Response.status(200).entity("Added product").build();
        } else {
            logger.info("Error : Product not added by {}", user.getUsername());
            return Response.status(400).entity("Error").build();
        }
    }

    //Update product info
    @PATCH
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProduct(@HeaderParam("token") String authenticationToken, @PathParam("id") Long pathProductId, ProductDto productDto) {
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
        }
        ProductDto product = productBean.findProductById(pathProductId);
        boolean isOwner = user.getUsername().equals(product.getSeller());
        if (product == null) {
            logger.error("Updating product - Product with id {} not found", pathProductId);
            return Response.status(404).entity("Product not found").build();
        }
        if (productDto.checkIfOnlyBuying()) {
            if (!isOwner) {
                if (product.getState() == ProductStateId.AVAILABLE && !product.getExcluded()) {
                    productDto.setId(product.getId());
                    productDto.setBuyer(user.getUsername());
                    if (productBean.updateProduct(productDto)) {
                        notificationBean.newProductNotification(NotificationType.PRODUCT_BOUGHT, product.getSeller(), user.getUsername(), product);
                        wsProducts.broadcastProduct(productBean.findProductById(pathProductId), "UPDATE");
                        logger.info("User {} bought ", user.getUsername(), product.getSeller());
                        return Response.status(200).entity("Bought product").build();
                    } else {
                        logger.error("Permission denied - {} tried to buy already bought or excluded product", user.getUsername());
                        return Response.status(403).entity("Permission denied - buying already bought or excluded product").build();
                    }

                } else {
                    logger.error("Permission denied - {} tried to buy already bought or excluded product", user.getUsername());
                    return Response.status(403).entity("Permission denied - buying already bought or excluded product").build();
                }
            } else {
                logger.error("Permission denied - {} tried to buy self product", user.getUsername());
                return Response.status(403).entity("Permission denied - buying owned product").build();
            }
        }
        if ((!isOwner) && !user.getAdmin()) {
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
                if (!isOwner) {
                    notificationBean.newProductNotification(NotificationType.PRODUCT_ALTERED, product.getSeller(), user.getUsername(), product);
                }
                wsProducts.broadcastProduct(productBean.findProductById(pathProductId), "UPDATE");
                logger.info("{} updated product {}", user.getUsername(), product.getId());
                return Response.status(200).entity("Updated product").build();
            } else {
                logger.info("Error : Product with id {} not updated by {}", product.getId(), user.getUsername());
                return Response.status(400).entity("Error").build();
            }
        }
    }


    //Deleting products
    @DELETE
    @Path("{id}")
    public Response deleteProduct(@HeaderParam("token") String authenticationToken, @PathParam("id") Long pathProductId) {
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
        }
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

    private ProductParameter resolveParameter(String param) {
        if (param == null || param.equalsIgnoreCase("DATE")) {
            return ProductParameter.DATE; // Default to "date" if null
        }
        try {
            return ProductParameter.valueOf(param.toLowerCase().trim()); // Convert valid value to enum
        } catch (IllegalArgumentException e) {
            logger.error("Invalid parameter value: {}", param);
            throw new WebApplicationException(
                    Response.status(400).entity("Invalid parameter value").build()
            );
        }
    }
}