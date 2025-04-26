package pt.uc.dei.proj5.service;

import pt.uc.dei.proj5.beans.*;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dto.*;

import java.util.ArrayList;
import java.util.Set;


@Path("/users")
public class UserService {
    private final Logger logger = LogManager.getLogger(UserService.class);

    @Inject
    UserBean userbean;

    @Inject
    AuthenticationService authenticationService;

    @Context
    private HttpServletRequest request;


    //Utilizar este para a maior parte das operações
    @GET
    @Path("/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserInformation(@HeaderParam("token") String authenticationToken, @PathParam("username") String userToGetInformation) {
        if (userToGetInformation.trim().equals("")) {
            logger.error("Invalid data - missing params - Getting another user information");
            return Response.status(400).entity("Invalid data").build();
        }
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
        }
        if (!userbean.checkIfUserExists(userToGetInformation)) {
            logger.error("User {} does not exist", userToGetInformation);
            return Response.status(404).entity("Invalid data").build();
        } else {
            UserDto userDto = userbean.getUserInformation(userToGetInformation);
            logger.info("User {} got user {} information", user.getUsername(), userDto.getUsername());
            return Response.status(200).entity(userDto).build();
        }
    }


    //update user information
    @PATCH
    @Path("/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateUser(@HeaderParam("token") String authenticationToken, @PathParam("username") String username, UserDto userDto) {
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
        }// Directly return HTTP response
        if (!user.getUsername().equals(username) && !user.getAdmin()) {
            logger.info("Permission denied - user {} tried to update another user {} without admin privileges", user.getUsername(), username);
            return Response.status(403).entity("Permission denied").build();
        }
        if (!userbean.checkIfUserExists(username)) {
            logger.info("User {} tried to update non-existent user {}", username, userDto.getUsername());
            return Response.status(404).entity("User does not exist").build();
        }
        if (userbean.updateUser(username, userDto)) {
            logger.info("User {} updated successfully", user.getUsername());
            return Response.status(200).entity("Updated user " + user.getUsername() + " successfully").build();
        } else {
            logger.error("Error updating user - User {} not updated", user.getUsername());
            return Response.status(500).entity("User " + user.getUsername() + " not updated").build();
        }
    }

    @PATCH
    @Path("/{username}/exclude")
    public Response excludeUser(@HeaderParam("token") String authenticationToken, @PathParam("username") String usernameUserExclude) {
        usernameUserExclude = usernameUserExclude.trim();
        if (usernameUserExclude.trim().equals("")) {
            logger.error("Invalid data - missing params - Excluding user");
            return Response.status(400).entity("Invalid data").build();
        }
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
        }// Directly return HTTP response
        if (!user.getAdmin()) {
            logger.error("User {} tried to exclude {} without admin permissions", user.getUsername(), usernameUserExclude);
            return Response.status(403).entity("User does not have admin permission to exclude other users").build();
        }
        if (!userbean.checkIfUserExists(usernameUserExclude)) {
            logger.error("User {} tried to exclude a user - {} - not found", user.getUsername(), usernameUserExclude);
            return Response.status(404).entity("User " + usernameUserExclude + " to exclude not found").build();
        }
        if (userbean.excludeUser(usernameUserExclude)) {
            logger.info("User {} excluded {} successfully", user.getUsername(), usernameUserExclude);
            return Response.status(200).entity("Excluded user " + usernameUserExclude + " successfully").build();
        } else {
            logger.error("User {} not excluded due to exception", usernameUserExclude);
            return Response.status(500).entity("User " + usernameUserExclude + " not excluded").build();
        }
    }


    @DELETE
    @Path("/{username}")
    public Response deleteUser(@HeaderParam("token") String authenticationToken, @PathParam("username") String usernameUserDelete) {
        if (usernameUserDelete.trim().equals("")) {
            logger.error("Invalid data - missing params - Deleting user");
            return Response.status(400).entity("Invalid data").build();
        }
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
        }// Directly return HTTP response
        if (!user.getAdmin()) {
            logger.error("User {} tried to delete {} without admin permissions", user.getUsername(), usernameUserDelete);
            return Response.status(403).entity("User does not have admin permission to delete other users").build();
        } else {
            if (!userbean.checkIfUserExists(usernameUserDelete.trim())) {
                logger.error("User {} tried to delete a user - {} - not found", user.getUsername(), usernameUserDelete);
                return Response.status(404).entity("User " + usernameUserDelete + " to delete not found").build();
            } else {
                if (userbean.deleteUser(usernameUserDelete.trim())) {
                    logger.info("User {} deleted {} successfully", user.getUsername(), usernameUserDelete);
                    return Response.status(200).entity("Deleted user " + usernameUserDelete + " successfully").build();
                } else {
                    logger.error("User {} not deleted due to exception", usernameUserDelete);
                    return Response.status(500).entity("User " + usernameUserDelete + " not deleted").build();
                }
            }
        }
    }


    @DELETE
    @Path("/{username}/products/")
    public Response deleteProductsOfUser(@HeaderParam("token") String authenticationToken, @PathParam("username") String usernameUserDeleteProducts) {
        if (usernameUserDeleteProducts.trim().equals("")) {
            logger.error("Invalid data - missing params - Deleting products of user");
            return Response.status(400).entity("Invalid data").build();
        }
        UserDto user = new UserDto();
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();  // Directly return HTTP response
        }
        if (!user.getAdmin()) {
            logger.error("User {} tried to delete products of user {} without admin permissions", user.getUsername(), usernameUserDeleteProducts);
            return Response.status(403).entity("User does not have admin permission to delete products of other users").build();
        } else {
            usernameUserDeleteProducts = usernameUserDeleteProducts.trim();
            if (!userbean.checkIfUserExists(usernameUserDeleteProducts)) {
                logger.error("User {} tried to delete products of user - {} - not found", user.getUsername(), usernameUserDeleteProducts);
                return Response.status(404).entity("User " + usernameUserDeleteProducts + " to delete products not found").build();
            } else {
                if (userbean.deleteProductsOfUser(usernameUserDeleteProducts)) {
                    logger.info("User {} deleted products of user {} successfully", user.getUsername(), usernameUserDeleteProducts);
                    return Response.status(200).entity("Deleted products of user " + usernameUserDeleteProducts + " successfully").build();
                } else {
                    logger.error("Products of user {} not deleted due to exception", usernameUserDeleteProducts);
                    return Response.status(500).entity("Products of user " + usernameUserDeleteProducts + " not deleted").build();
                }
            }
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserInformation(@HeaderParam("token") String authenticationToken,
                                       @QueryParam("username") String usernameToSearch,
                                       @QueryParam("firstName") String firstNameToSearch,
                                       @QueryParam("lastName") String lastNameToSearch,
                                       @QueryParam("email") String emailToSearch,
                                       @QueryParam("phone") String phoneToSearch,
                                       @QueryParam("state") String stateToSearch,
                                       @QueryParam("parameter") String parameterToOrder,
                                       @QueryParam("order") String orderBy) {
        UserDto user = null;
        String username = null;
        String firstName = null;
        String lastName = null;
        String email = null;
        String phone = null;
        UserAccountState state = null;
        if(authenticationToken!=null && !authenticationToken.isEmpty()) {
            try {
                user = authenticationService.validateAuthenticationToken(authenticationToken);
            } catch (WebApplicationException e) {
                return e.getResponse();
            }
            if (user.getAdmin()) {
                state = UserAccountState.EXCLUDED;
            }
        }
        UserParameter parameter = UserParameter.USERNAME;
        Order order = Order.asc;
        if (usernameToSearch != null && !usernameToSearch.trim().equals("")) {
            username = usernameToSearch.trim();
        }
        if (firstNameToSearch != null && !firstNameToSearch.trim().equals("")) {
            firstName = firstNameToSearch.trim();
        }
        if (lastNameToSearch != null && !lastNameToSearch.trim().equals("")) {
            lastName = lastNameToSearch.trim();
        }
        if (emailToSearch != null && !emailToSearch.trim().equals("")) {
            email = emailToSearch.trim();
        }
        if (phoneToSearch != null && !phoneToSearch.trim().equals("")) {
            phone = phoneToSearch.trim();
        }
        if (stateToSearch != null && !stateToSearch.trim().equals("")) {
            state = stringToUserState(stateToSearch);
            if (state == null) {
                return Response.status(404).entity("Invalid user state").build();
            }
        }
        if (parameterToOrder != null && !parameterToOrder.trim().equals("")) {
            parameter = stringToParameter(parameterToOrder);
            if (parameter == null) {
                return Response.status(404).entity("Invalid parameter").build();
            }
        }
        if (orderBy != null && !orderBy.trim().equals("")) {
            order = stringToOrder(orderBy);
            if (order == null) {
                return Response.status(404).entity("Invalid order").build();
            }
        }
        Set<UserDto> users = userbean.getUsers(username, firstName, lastName, email, phone, state, parameter, order);
        if (users != null) {
            return Response.status(200).entity(users).build();
        } else {
            return Response.status(404).entity("Error getting users").build();
        }
    }

    private UserAccountState stringToUserState(String state) {
        try {
            return UserAccountState.valueOf(state.trim());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private UserParameter stringToParameter(String parameter) {
        try {
            return UserParameter.valueOf(parameter.trim());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private Order stringToOrder(String order) {
        try {
            return Order.valueOf(order.trim());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

}