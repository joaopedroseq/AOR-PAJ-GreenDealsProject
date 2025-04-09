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
import pt.uc.dei.proj5.dto.*;

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
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCategories(@QueryParam("locale") String languageParameter) {
        if (languageParameter == null || languageParameter.trim().isEmpty()) {
            logger.error("Invalid data locale - getting all categories");
            return Response.status(400).entity("Missing data").build();
        }
        if (!languageParameter.trim().equalsIgnoreCase("en") && !languageParameter.trim().equalsIgnoreCase("pt")) {
            logger.error("Invalid data locale - getting all categories");
            return Response.status(400).entity("Invalid data").build();
        }
        Language language = Language.valueOf(languageParameter.toUpperCase());
        List<CategoryDto> categories = categoryBean.getAllCategories(language);
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
    public Response registerNewCategory(@HeaderParam("token") String authenticationToken, CategoryDto categoryDto) {
        if (authenticationToken == null || authenticationToken.trim().isEmpty()) {
            logger.error("Invalid token(null) - adding new category - {}", categoryDto.getNome());
            return Response.status(401).entity("Invalid token").build();
        } else if (!categoryDto.hasValidValues()) {
            logger.error("Invalid data - register new category");
            return Response.status(400).entity("Invalid data").build();
        } else {
            TokenDto tokenDto = new TokenDto();
            tokenDto.setAuthenticationToken(authenticationToken);
            UserDto user = tokenBean.checkToken(tokenDto, TokenType.AUTHENTICATION);
            if (user == null) {
                logger.error("Invalid token - adding new category - {}", categoryDto.getNome());
                return Response.status(401).entity("Invalid token").build();
            }
            if (user.getState() == UserAccountState.INACTIVE || user.getState() == UserAccountState.EXCLUDED) {
                logger.error("Permission denied - user {} tried to add new category {} with inactive or excluded account", user.getUsername(), categoryDto.getNome());
                return Response.status(403).entity("User has inactive or excluded account").build();
            }
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

    @DELETE
    @Path("/{categoryName}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteCategory(@HeaderParam("token") String authenticationToken, @PathParam("categoryName") String categoryName) {
        if (authenticationToken == null || authenticationToken.trim().isEmpty()) {
            logger.error("Invalid token (null) - deleting category - {}", categoryName);
            return Response.status(401).entity("Missing token").build();
        } else {
            TokenDto tokenDto = new TokenDto();
            tokenDto.setAuthenticationToken(authenticationToken);
            UserDto user = tokenBean.checkToken(tokenDto, TokenType.AUTHENTICATION);
            if (user == null) {
                logger.error("Invalid token when trying to delete category {}", categoryName);
                return Response.status(401).entity("Invalid token").build();
            }
            if (user.getState() == UserAccountState.INACTIVE || user.getState() == UserAccountState.EXCLUDED) {
                logger.error("Permission denied - user {} tried to delete category {} information with inactive or excluded account", user.getUsername(), categoryName);
                return Response.status(403).entity("User has inactive or excluded account").build();
            }
            if (!user.getAdmin()) {
                logger.error("User {} tried to delete category {} without admin permissions", user.getUsername(), categoryName);
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