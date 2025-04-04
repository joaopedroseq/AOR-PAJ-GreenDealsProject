package pt.uc.dei.proj5.service;

import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.beans.UserBean;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dto.*;


@Path("/auth")
public class AuthenticationService {
    private final Logger logger = LogManager.getLogger(UserService.class);

    @Inject
    UserBean userbean;

    @Inject
    TokenBean tokenbean;

    //Regular user register
    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerUser(UserDto userDto) {
        logger.info("Registering user: " + userDto);
        if (!userDto.hasValidValues()) {
            logger.error("Invalid data - missing params - Registering user");
            return Response.status(400).entity("Invalid data").build();
        }
        if (userbean.registerNormalUser(userDto)) {
            logger.info("Registering user: " + userDto);
            return Response.status(200).entity("The new user is registered").build();
        } else {
            logger.error("Same username conflict - Registering user");
            return Response.status(409).entity("There is a user with the same username!").build();
        }
    }

    //Admin user register
    @POST
    @Path("/registerAdmin")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerAdmin(UserDto userDto) {
        if (!userDto.hasValidValues()) {
            logger.error("Invalid data - registering new admin {}", userDto.getUsername());
            return Response.status(400).entity("Invalid Data").build();
        }
        if (userbean.registerAdmin(userDto)) {
            logger.info("New admin registered {}", userDto.getUsername());
            return Response.status(200).entity("The new admin is registered").build();
        } else {
            logger.error("Same username conflict - Registering admin {}", userDto.getUsername());
            return Response.status(409).entity("There is a user with the same username!").build();
        }
    }

    //User login
    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(LoginDto user) {
        if (!user.hasValidValues()) {
            logger.error("Invalid data - login from user {}", user.getUsername());
            return Response.status(400).entity("Invalid data").build();
        }
        if(!userbean.checkIfUserExists(user.getUsername())){
            logger.error("Login failed from {} - wrong username/password", user.getUsername());
            return Response.status(401).entity("Invalid data").build();
        }
        if(userbean.getUserInformation(user.getUsername()).getExcluded()){
            logger.error("Login failed from excluded user {}", user.getUsername());
            return Response.status(403).entity("Forbidden - excluded user").build();
        }
        String token = tokenbean.login(user);
        if (token == null) {
            logger.error("Login failed from {} - wrong username/password", user.getUsername());
            return Response.status(401).entity("Wrong Username or Password!").build();
        } else {
            logger.info("Login from {} successful", user.getUsername());
            return Response.status(200).entity(token).build();
        }
    }

    //User logout
    @POST
    @Path("/logout")
    public Response logout(@HeaderParam("token") String token) {
        if (tokenbean.logout(token)) {
            logger.info("Logout successful");
            return Response.status(200).entity("Logout Successful!").build();
        } else {
            logger.error("Logout failed");
            return Response.status(401).entity("Invalid Token!").build();
        }
    }

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

    //Apenas utilizar este para o login
    @GET
    @Path("/me")
    public Response getUserLogged(@HeaderParam("token") String token) {
        UserDto user = tokenbean.verifyAuthenticationToken(token);
        if (user == null) {
            logger.error("Invalid token");
            return Response.status(401).entity("Invalid token").build();
        } else {
            logger.info("User information retrieved from user {}", user.getUsername());
            return Response.status(200).entity(user).build();
        }
    }
}