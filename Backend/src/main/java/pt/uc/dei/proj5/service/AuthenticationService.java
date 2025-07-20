package pt.uc.dei.proj5.service;

import jakarta.transaction.Transactional;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.beans.UserBean;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dto.*;
import pt.uc.dei.proj5.websocket.WsUsers;


@Path("/auth")
public class AuthenticationService {
    private final Logger logger = LogManager.getLogger(UserService.class);

    @Inject
    UserBean userbean;

    @Inject
    TokenBean tokenbean;

    @Inject
    WsUsers wsUsers;


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
        String activationToken = userbean.registerNormalUser(userDto);
        if(activationToken != null) {
            wsUsers.broadcastUser(userDto, "NEW");
            logger.info("Registered user: " + userDto);
            EmailService emailService = new EmailService();
            emailService.sendActivationEmail(userDto.getFirstName(), userDto.getEmail(), activationToken);
            return Response.status(200).entity(activationToken).build();
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
        if (!userbean.checkIfUserExists(user.getUsername())) {
            logger.error("Login failed from {} - wrong username/password", user.getUsername());
            return Response.status(401).entity("Invalid data").build();
        }
        UserDto userToLogin = userbean.getUserInformation(user.getUsername());
        if (userToLogin.getState() == UserAccountState.EXCLUDED) {
            logger.error("Login failed from excluded user {}", user.getUsername());
            return Response.status(403).entity("Forbidden - excluded user").build();
        }
        if (userToLogin.getState() == UserAccountState.INACTIVE) {
            logger.error("Login failed from inactive user {}", user.getUsername());
            return Response.status(403).entity("Forbidden - inactive user").build();
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
        TokenDto tokenDto = new TokenDto();
        tokenDto.setTokenValue(token);
        if (tokenbean.logout(tokenDto)) {
            logger.info("Logout successful");
            return Response.status(200).entity("Logout Successful!").build();
        } else {
            logger.error("Logout failed");
            return Response.status(401).entity("Invalid Token.").build();
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
        UserDto userToLogin = userbean.getUserInformation(user.getUsername());
        if (userToLogin.getState() == UserAccountState.EXCLUDED) {
            logger.error("User {} tried to confirm password with excluded account ", user.getUsername());
            return Response.status(403).entity("Forbidden - excluded user").build();
        }
        if (userToLogin.getState() == UserAccountState.INACTIVE) {
            logger.error("User {} tried to confirm password with inactive account", user.getUsername());
            return Response.status(403).entity("Forbidden - inactive user").build();
        }
        if (!userbean.checkPassword(user)) {
            logger.error("Incorrect password from {} - wrong username/password", user.getUsername());
            return Response.status(401).entity("Wrong Username or Password !").build();
        } else {
            logger.info("Confirmed password {} successful", user.getUsername());
            return Response.status(200).entity("Confirmed password").build();
        }
    }

    @POST
    @Path("/request-password-reset")
    @Produces(MediaType.APPLICATION_JSON)
    public Response requestPasswordReset(@HeaderParam("token") String authenticationToken) {
        UserDto user = null;
        if (authenticationToken != null) {
            try {
                user = validateAuthenticationToken(authenticationToken);
            } catch (WebApplicationException e) {
                return e.getResponse();
            }
        }
        String passwordResetToken = userbean.generateNewPasswordResetToken(user);
        if(passwordResetToken != null) {
            logger.info("Password reset requested for user {}", user.getUsername());
            return Response.status(200).entity(passwordResetToken).build();
        } else {
            logger.error("Password reset requested for user {} but failed", user.getUsername());
            return Response.status(404).entity("Password reset requested but failed").build();
        }
    }

    @POST
    @Path("/reset-password")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.APPLICATION_JSON)
    public Response resetPassword(@HeaderParam("token") String passwordResetToken, String password) {
        UserDto user = null;
        if (passwordResetToken != null) {
            try {
                user = validatePasswordResetToken(passwordResetToken);
            } catch (WebApplicationException e) {
                return e.getResponse();
            }
        }
        TokenDto tokenDto = new TokenDto();
        tokenDto.setTokenValue(passwordResetToken);
        tokenbean.revokeToken(tokenDto);
        user.setPassword(password);
        if (userbean.updateUser(user.getUsername(), user)) {
            logger.info("Password reset for user {} successful", user.getUsername());
            return Response.status(200).entity("Password reset successful").build();
        } else {
            logger.error("Password reset for user {} failed", user.getUsername());
            return Response.status(404).entity("Password reset failed").build();
        }
    }

    @POST
    @Path("/activate")
    @Produces(MediaType.APPLICATION_JSON)
    public Response activateAccount(@HeaderParam("token") String activationToken) {
        if (activationToken == null || activationToken.trim().isEmpty()) {
            logger.error("Missing token (null)");
            return Response.status(401).entity("Missing token").build();
        }
        TokenDto tokenDto = new TokenDto();
        tokenDto.setTokenValue(activationToken);
        UserDto user = tokenbean.checkToken(tokenDto);
        if (user == null) {
            logger.error("Invalid token");
            return Response.status(401).entity("Invalid token").build();
        }
        if (user.getState() == UserAccountState.ACTIVE) {
            logger.error("User {} tried activate already active account", user.getUsername());
            return Response.status(403).entity("Bad request - already active account").build();
        }
        if (user.getState() == UserAccountState.EXCLUDED) {
            logger.error("User {} tried activate excluded account", user.getUsername());
            return Response.status(403).entity("Bad request - excluded account").build();
        } else {
            tokenDto = tokenbean.getTokenByValue(activationToken);
            if (!tokenbean.isTokenExpired(tokenDto, TokenType.ACTIVATION)) {
                user.setState(UserAccountState.ACTIVE);
                if (userbean.updateUser(user.getUsername(), user)) {
                    logger.info("User {} activated his account", user.getUsername());
                    return Response.status(200).entity("Activated account").build();
                } else {
                    logger.error("Error activating user {} account", user.getUsername());
                    return Response.status(500).entity("User " + user.getUsername() + " account not activated").build();
                }
            } else {
                //Mudar por um método para adicionar um activation token
                String newActivationToken = tokenbean.generateNewActivationToken(user);
                logger.error("User {} tried to activate account with expired token. New activation token generated", user.getUsername());
                return Response.status(409).entity(newActivationToken).build();
            }
        }
    }

    //Apenas utilizar este para o login
    @GET
    @Path("/me")
    public Response getUserLogged(@HeaderParam("token") String token) {
        TokenDto tokenDto = new TokenDto();
        tokenDto.setTokenValue(token);
        UserDto user = tokenbean.checkToken(tokenDto);
        if (user == null) {
            logger.error("Invalid token");
            return Response.status(401).entity("Invalid token").build();
        }
        if (user.getState() == UserAccountState.INACTIVE) {
            logger.error("User {} tried to get it's information with inactive", user.getUsername());
            return Response.status(403).entity("Forbidden - inactive account").build();
        }
        if (user.getState() == UserAccountState.EXCLUDED) {
            logger.error("User {} tried to get it's information with excluded account", user.getUsername());
            return Response.status(403).entity("Forbidden - excluded account").build();
        } else {
            logger.info("User information retrieved from user {}", user.getUsername());
            return Response.status(200).entity(user).build();
        }
    }



    public UserDto validateAuthenticationToken(String token) throws WebApplicationException {
        if (token == null || token.trim().isEmpty()) {
            throw new WebApplicationException(Response.status(401).entity("Missing token").build());
        }
        TokenDto tokenDto = tokenbean.getTokenByValue(token);
        if(tokenDto == null){
            throw new WebApplicationException(Response.status(401).entity("Invalid token").build());
        }
        if(tokenbean.isTokenExpired(tokenDto, TokenType.AUTHENTICATION)) {
            throw new WebApplicationException(Response.status(401).entity("Expired token").build());
        }
        UserDto user = tokenbean.checkToken(tokenDto);
        if (user == null) {
            throw new WebApplicationException(Response.status(401).entity("Invalid token").build());
        }
        if (user.getState() == UserAccountState.INACTIVE || user.getState() == UserAccountState.EXCLUDED) {
            throw new WebApplicationException(Response.status(403).entity("User has inactive or excluded account").build());
        }
        else {
            tokenbean.renovateToken(tokenDto);
            return user;
        }
    }

    public UserDto validatePasswordResetToken(String token) throws WebApplicationException {
        if (token == null || token.trim().isEmpty()) {
            throw new WebApplicationException(Response.status(401).entity("Missing token").build());
        }
        TokenDto tokenDto = tokenbean.getTokenByValue(token);
        if(tokenDto == null){
            throw new WebApplicationException(Response.status(401).entity("Invalid token").build());
        }
        if(tokenbean.isTokenExpired(tokenDto, TokenType.PASSWORD_RESET)) {
            throw new WebApplicationException(Response.status(401).entity("Expired token").build());
        }
        UserDto user = tokenbean.checkToken(tokenDto);
        if (user == null) {
            throw new WebApplicationException(Response.status(401).entity("Invalid token").build());
        }
        if (user.getState() == UserAccountState.INACTIVE || user.getState() == UserAccountState.EXCLUDED) {
            throw new WebApplicationException(Response.status(403).entity("User has inactive or excluded account").build());
        }
        return user;
    }
}