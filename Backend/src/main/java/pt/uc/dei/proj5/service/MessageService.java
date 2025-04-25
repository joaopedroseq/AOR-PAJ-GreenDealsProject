package pt.uc.dei.proj5.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.MessageBean;
import pt.uc.dei.proj5.beans.UserBean;
import pt.uc.dei.proj5.dto.*;

import java.util.List;

@Path("/messages")
public class MessageService {
    private static final Logger logger = LogManager.getLogger(MessageService.class);

    @Inject
    AuthenticationService authenticationService;

    @Inject
    UserBean userBean;

    @Inject
    MessageBean messageBean;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("{username}")
    public Response getChat(@HeaderParam("token") String authenticationToken,
                            @PathParam("username") String username) {
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
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
        List<MessageDto> conversation = messageBean.getMessagesBetween(user, otherUser);
        if (conversation == null) {
            logger.error("Invalid conversation - getting messages");
            return Response.status(404).entity("No conversation found").build();
        } else {
            logger.info("Conversation retrieved");
            return Response.status(200).entity(conversation).build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("all")
    public Response getAllUsersWhoChat(@HeaderParam("token") String authenticationToken) {
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
        }
        List<UserDto> userList = messageBean.getAllChats(user);
        if (userList == null) {
            logger.error("Invalid conversation - getting messages");
            return Response.status(404).entity("No conversations found").build();
        } else {
            logger.info("All conversations retrieved");
            return Response.status(200).entity(userList).build();
        }
    }
}