package pt.uc.dei.proj5.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.CategoryBean;
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.beans.UserBean;
import pt.uc.dei.proj5.dto.CategoryDto;
import pt.uc.dei.proj5.dto.UserDto;

import java.util.List;

@Path("/categories")
public class CategoryService {
    private final Logger logger = LogManager.getLogger(CategoryService.class);

    @Inject
    CategoryBean categoryBean;

    @Inject
    UserBean userbean;

    @Inject
    TokenBean tokenBean;

    @GET
    public Response getAllCategories() {
        List<CategoryDto> categories = categoryBean.getAllCategories();
        if (categories != null) {
            logger.info(" {} categories found", categories.size());
            return Response.status(200).entity(categories).build();
        } else {
            logger.error("Error getting categories");
            return Response.status(400).entity("Error getting categories").build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerNewCategory(@HeaderParam("token") String token, CategoryDto categoryDto) {
        if (token == null || token.trim().isEmpty()) {
            logger.error("Invalid token(null) - adding new category - {}", categoryDto.getNome());
            return Response.status(401).entity("Invalid token").build();
        } else if (!categoryDto.hasValidValues()) {
            logger.error("Invalid data - register new category");
            return Response.status(400).entity("Invalid data").build();
        } else {
            UserDto user = tokenBean.verifyAuthenticationToken(token);
            if (user == null) {
                logger.error("Invalid token - adding new category - {}", categoryDto.getNome());
                return Response.status(401).entity("Invalid token").build();
            } else {
                if (!user.getAdmin()) {
                    logger.error("Permission denied - not admin privileges - {} adding new category - {}", user.getUsername(), categoryDto.getNome());
                    return Response.status(403).entity("Permission denied").build();
                } else {
                    if (!categoryBean.registerNewCategory(categoryDto)) {
                        logger.error("Conflict - category {} already exists - {}", user.getUsername(), categoryDto.getNome());
                        return Response.status(409).entity("{\"message\": \"Conflict - category already exists\"}").type(MediaType.APPLICATION_JSON).build();
                    } else {
                        logger.info("Added new category - {} - by {}", categoryDto.getNome(), user.getUsername());
                        return Response.status(200).entity("{\"message\": \"Added new category " + categoryDto.getNome() + "\"}").type(MediaType.APPLICATION_JSON).build();
                    }
                }
            }
        }
    }

    @DELETE
    @Path("/{categoryName}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteCategory(@HeaderParam("token") String token, @PathParam("categoryName") String categoryName) {
        if (token == null || token.trim().isEmpty()) {
            logger.error("Invalid token (null) - deleting category - {}", categoryName);
            return Response.status(401).entity("Missing token").build();
        }
        if (!tokenBean.checkIfAuthenticationTokenValid(token)) {
            logger.error("Invalid token(null) - deleting category - {}", categoryName);
            return Response.status(401).entity("Invalid token").build();
        } else {
            UserDto user = tokenBean.verifyAuthenticationToken(token);
            if (user == null) {
                logger.error("Invalid token when trying to delete category {}", categoryName);
                return Response.status(401).entity("Invalid token").build();
            } else {
                if (!user.getAdmin()) {
                    logger.error("User {} tried to exclude {} without admin permissions", user.getUsername(), categoryName);
                    return Response.status(403).entity("User does not have admin permission to delete categories").build();
                } else {
                    CategoryDto categoryDto = new CategoryDto();
                    categoryDto.setNome(categoryName.toLowerCase().trim());
                    if (!categoryBean.checkIfCategoryExists(categoryDto)) {
                        logger.info("User {} tried to delete category {} non-existent", categoryDto.getNome(), user.getUsername());
                        return Response.status(404).entity("Category " + categoryDto.getNome() + " doesn't exist").build();
                    } else {
                        if (categoryBean.deleteCategory(categoryDto)) {
                            logger.info("Deleted category - {} - by {}", categoryDto.getNome(), user.getUsername());
                            return Response.status(200).entity("Deleted category " + categoryDto.getNome()).build();
                        } else {
                            logger.error("Failed to delete {} by {}", categoryDto.getNome(), user.getUsername());
                            return Response.status(404).entity("Failed to delete " + categoryDto.getNome()).build();
                        }
                    }
                }
            }
        }
    }
}