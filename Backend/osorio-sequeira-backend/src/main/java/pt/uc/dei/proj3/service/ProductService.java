package pt.uc.dei.proj3.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj3.beans.ProductBean;
import pt.uc.dei.proj3.beans.UserBean;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.UserDto;

import java.util.Set;


@Path("/products")
public class ProductService {
    private static final Logger logger = LogManager.getLogger(ProductService.class);

    @Inject
    ProductBean productBean;

    @Inject
    UserBean userbean;

    @GET
    @Path("/products")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getActiveProducts() {
        Set<ProductDto> produtos = userbean.getActiveProducts();
        if (produtos != null) {
            return Response.status(200).entity(produtos).build();
        } else {
            return Response.status(400).entity("Error getting active products").build();
        }
    }

    @GET
    @Path("/products/excluded")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProducts(@HeaderParam("token") String token) {
        UserDto user = userbean.verifyToken(token);
        if (user == null) {
            logger.error("Invalid token - updateProduct");
            return Response.status(401).entity("Invalid token").build();
        } else if(!user.getAdmin()) {
            logger.error("Permision denied - {} getting all products",user.getUsername());
            return Response.status(403).entity("Permission denied").build();
        }else{
            Set<ProductDto> produtos = userbean.getAllProducts();
            if (produtos != null) {
                return Response.status(200).entity(produtos).build();
            } else {
                return Response.status(400).entity("Error getting all products").build();
            }
        }
    }


    //todo get all edited Products
}
