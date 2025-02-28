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
import pt.uc.dei.proj3.dao.CategoryDao;
import pt.uc.dei.proj3.dto.CategoryDto;
import pt.uc.dei.proj3.dto.UserDto;

@Path("/category")
public class CategoryService {
    private final Logger logger = LogManager.getLogger(CategoryService.class);

    @Inject
    CategoryBean categoryBean;

    @Inject
    ApplicationBean applicationBean;

    @Context
    private HttpServletRequest request;

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerNewCategory(@HeaderParam("token") String token, CategoryDto categoryDto) {
        if (!categoryDto.isValid()) {
            logger.error("Invalid data - register new category");
            return Response.status(400).entity("Invalid data").build();
        }
        //para apagar
        return null;
    }

}
