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
import pt.uc.dei.proj4.dto.CategoryDto;
import pt.uc.dei.proj4.dto.ProductDto;
import pt.uc.dei.proj4.dto.UserDto;

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
    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAvailableProducts() {
        Set<ProductDto> produtos = userbean.getAvailableProducts();
        if (produtos != null) {
            return Response.status(200).entity(produtos).build();
        } else {
            return Response.status(400).entity("Error getting available products").build();
        }
    }

    //All products by category - non excluded state 2 (DISPONIVEL)
    @GET
    @Path("/{category}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductByCategory(@HeaderParam("token") String token, @PathParam("category") String category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setName(category);
        if (!categoryBean.checkIfCategoryAlreadyExists(categoryDto)) {
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
}

