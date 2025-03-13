package pt.uc.dei.proj4.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj4.beans.CategoryBean;
import pt.uc.dei.proj4.beans.UserBean;
import pt.uc.dei.proj4.dto.CategoryDto;
import pt.uc.dei.proj4.dto.UserDto;

import java.util.Set;

@Path("/category")
public class CategoryService {
    private final Logger logger = LogManager.getLogger(CategoryService.class);

    @Inject
    CategoryBean categoryBean;

    @Inject
    UserBean userbean;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerNewCategory(@HeaderParam("token") String token, CategoryDto categoryDto) {
        if (token == null || token.trim().isEmpty()) {
            logger.error("Invalid token(null) - adding new category - {}", categoryDto.getName());
            return Response.status(401).entity("Invalid token").build();
        } else if (!categoryDto.hasValidValues()) {
            logger.error("Invalid data - register new category");
            return Response.status(400).entity("Invalid data").build();
        } else {
            UserDto user = userbean.verifyToken(token);
            if (user == null) {
                logger.error("Invalid token - adding new category - {}", categoryDto.getName());
                return Response.status(401).entity("Invalid token").build();
            } else {
                if (!user.getAdmin()) {
                    logger.error("Permission denied - not admin privileges - {} adding new category - {}", user.getUsername(), categoryDto.getName());
                    return Response.status(403).entity("Permission denied").build();
                } else {
                    if (!categoryBean.registerNewCategory(categoryDto)) {
                        logger.error("Conflict - category {} already exists - {}", user.getUsername(), categoryDto.getName());
                        return Response.status(409).entity("{\"message\": \"Conflict - category already exists\"}").type(MediaType.APPLICATION_JSON).build();
                    } else {
                        logger.info("Added new category - {} - by {}", categoryDto.getName(), user.getUsername());
                        return Response.status(200).entity("{\"message\": \"Added new category " + categoryDto.getName() +  "\"}").type(MediaType.APPLICATION_JSON).build();
                    }
                }
            }
        }
    }

    @DELETE
    @Path("/delete")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteCategory(@HeaderParam("token") String token, CategoryDto categoryDto) {
        if (!userbean.checkIfTokenValid(token)) {
            logger.error("Invalid token(null) - deleting category - {}", categoryDto.getName());
            return Response.status(401).entity("Invalid token").build();
        } else {
            UserDto user = userbean.verifyToken(token);
            if (user == null) {
                logger.error("Invalid token when trying to delete category {}", categoryDto.getName());
                return Response.status(401).entity("Invalid token").build();
            } else {
                if (!user.getAdmin()) {
                    logger.error("User {} tried to exclude {} without admin permissions", user.getUsername(), categoryDto.getName());
                    return Response.status(403).entity("User does not have admin permission to delete categories").build();
                } else {
                    categoryDto.setName(categoryDto.getName().toLowerCase().trim());
                    if (!categoryBean.checkIfCategoryAlreadyExists(categoryDto)) {
                        logger.info("User {} tried to delete category {} non-existent", categoryDto.getName(), user.getUsername());
                        return Response.status(404).entity("Category " + categoryDto.getName() + " doesn't exist").build();
                    } else {
                        if (categoryBean.deleteCategory(categoryDto)) {
                            logger.info("Deleted category - {} - by {}", categoryDto.getName(), user.getUsername());
                            return Response.status(200).entity("Deleted category " + categoryDto.getName()).build();
                        } else {
                            logger.error("Failed to delete {} by {}", categoryDto.getName(), user.getUsername());
                            return Response.status(404).entity("Failed to delete " + categoryDto.getName()).build();
                        }
                    }
                }
            }
        }
    }

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategories() {
        Set<CategoryDto> categories = categoryBean.getAllCategories();
        if (categories != null) {
            logger.info(" {} categories found", categories.size());
            return Response.status(200).entity(categories).build();
        } else {
            logger.error("Error getting categories");
            return Response.status(400).entity("Error getting categories").build();
        }
    }
}