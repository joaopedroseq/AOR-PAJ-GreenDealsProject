package pt.uc.dei.proj4.service;

import pt.uc.dei.proj4.beans.UserBean;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj4.dto.*;


@Path("/auth")
public class AuthenticationService {
    private final Logger logger = LogManager.getLogger(UserService.class);

    @Inject
    UserBean userbean;

    //User login
    @POST
    @Path("/confirm-password")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response confirmPassword(LoginDto user) {
        if (!user.hasValidValues()) {
            logger.error("Invalid data - login from user {}", user.getUsername());
            return Response.status(400).entity("Invalid data").build();
        }
        if (!userbean.checkPassword(user)) {
            logger.error("Incorrect password from {} - wrong username/password", user.getUsername());
            return Response.status(401).entity("Wrong Username or Password !").build();
        } else {
            logger.info("Confirmed password {} successful", user.getUsername());
            return Response.status(200).entity("Confirmed password").build();
        }
    }
}