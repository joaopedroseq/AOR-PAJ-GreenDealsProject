package pt.uc.dei.proj5.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.MessageBean;
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.beans.UserBean;
import pt.uc.dei.proj5.dto.*;

@Path("/messages")
public class MessageService {
    private static final Logger logger = LogManager.getLogger(MessageService.class);

    @Inject
    TokenBean tokenBean;

    @Inject
    UserBean userBean;

    @Inject
    MessageBean messageBean;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("chat/{username}")
    public Response getChat(@HeaderParam("token") String authenticationToken,
                                @PathParam("username") String username) {
        if (authenticationToken == null || authenticationToken.trim().isEmpty()) {
            logger.error("Invalid token (null) - getting messages from {}", username);
            return Response.status(401).entity("Missing token").build();
        }
        TokenDto tokenDto = new TokenDto();
        tokenDto.setAuthenticationToken(authenticationToken);
        UserDto user = tokenBean.checkToken(tokenDto, TokenType.AUTHENTICATION);
        if (user == null) {
            logger.error("Invalid token - getting messages");
            return Response.status(401).entity("Invalid token").build();
        }
        if (user.getState() == UserAccountState.INACTIVE || user.getState() == UserAccountState.EXCLUDED) {
            logger.error("Permission denied - user {} tried getting messages from  {} with inactive or excluded account", user.getUsername(), username);
            return Response.status(403).entity("User has inactive or excluded account").build();
        }
        UserDto otherUser = userBean.getUserInformation(username);
        if (otherUser == null) {
            logger.error("Invalid other user - getting messages");
            return Response.status(404).entity("Other user doesn't exist").build();
        }
        if (otherUser.getState() == UserAccountState.INACTIVE || otherUser.getState() == UserAccountState.EXCLUDED) {
            logger.error("Invalid other user - getting messages");
            return Response.status(403).entity("Other user has inactive or excluded account").build();
        }
        else{
            ChatDto conversation = messageBean.getChatBetween(user, otherUser);
            if(conversation == null){
                logger.error("Invalid conversation - getting messages");
                return Response.status(404).entity("No conversation").build();
            }
            else {
                logger.info("Conversation retrieved");
                return Response.status(200).entity(conversation).build();
            }
        }
    }
}