package pt.uc.dei.proj3.service;

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj3.beans.ApplicationBean;
import pt.uc.dei.proj3.beans.CategoryBean;
import pt.uc.dei.proj3.beans.UserBean;
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dto.CategoryDto;
import pt.uc.dei.proj3.dto.UserDto;
import pt.uc.dei.proj3.entity.UserEntity;

@Path("/category")
public class CategoryService {
    private final Logger logger = LogManager.getLogger(CategoryService.class);

    @Inject
    CategoryBean categoryBean;

    @Inject
    ApplicationBean applicationBean;

    @Inject
    UserBean userbean;

    @Context
    private HttpServletRequest request;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerNewCategory(@HeaderParam("token") String token, CategoryDto categoryDto) {
        if (token == null || token.trim().isEmpty()) {
            logger.error("Invalid token - adding new category - {}", categoryDto.getName());
            return Response.status(401).entity("Invalid token").build();
        } else if (!categoryDto.isValid()) {
            logger.error("Invalid data - register new category");
            return Response.status(400).entity("Invalid data").build();
        } else {
            UserDto user = userbean.verifyToken(token);
            if (user == null) {
                logger.error("Invalid token for user {}- adding new category - {}", user.getUsername(), categoryDto.getName());
                return Response.status(401).entity("Invalid token").build();
            } else {
                if (!user.getAdmin()) {
                    logger.error("Permission denied - not admin privileges - {} adding new category - {}", user.getUsername(), categoryDto.getName());
                    return Response.status(403).entity("Permission denied").build();
                } else {
                    if (!categoryBean.registerNewCategory(categoryDto)) {
                        logger.error("Conflict - category {} already exists - {}", user.getUsername(), categoryDto.getName());
                        return Response.status(409).entity("Conflict - category already exists").build();
                    } else {
                        logger.info("Added new category - {} - by {}", categoryDto.getName(), user.getUsername());
                        return Response.status(200).entity("Added product").build();
                    }
                }
            }
        }
    }
}