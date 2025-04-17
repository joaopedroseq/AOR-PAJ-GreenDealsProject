package pt.uc.dei.proj5.websocket;

import jakarta.inject.Inject;
import jakarta.websocket.Session;
import jakarta.json.JsonObject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.dto.TokenDto;
import pt.uc.dei.proj5.dto.TokenType;
import pt.uc.dei.proj5.dto.UserDto;
import pt.uc.dei.proj5.dto.UserAccountState;
import java.io.IOException;
import java.util.HashMap;
/*
{
    "type" : "AUTHENTICATION",
    "token": "ttIMhhGurQMoiP7H-_c5_EsCWATkmVJ5"
}
 */

/*
{
    "type": "MESSAGE",
    "recipient": "anotherUser",
    "message": "Hello there!"
}

 */
public class WebSocketAuthentication {
    private static final Logger logger = LogManager.getLogger(WebSocketAuthentication.class);


    public static boolean authenticate(Session session, JsonObject jsonMessage,
                                       TokenBean tokenBean, HashMap<String, Session> sessions,
                                       HashMap<String, String> sessionUser) {
        if (!jsonMessage.containsKey("token") || jsonMessage.isNull("token")) {
            sendErrorMessage(session, "Missing authentication token");
            return false;
        }

        String token = jsonMessage.getString("token");
        TokenDto tokenDto = new TokenDto();
        tokenDto.setAuthenticationToken(token);

        try {
            UserDto user = tokenBean.checkToken(tokenDto, TokenType.AUTHENTICATION);
            if (user.getState().equals(UserAccountState.EXCLUDED) || user.getState().equals(UserAccountState.INACTIVE)) {
                logger.info("Authentication failed: User {} has inactive or excluded account", user.getUsername());
                sendErrorMessage(session, "Excluded or inactive user");
                return false;
            }
            // Successfully authenticated, store session
            sessions.put(user.getUsername(), session);
            sessionUser.put(session.getId(), user.getUsername());

            logger.info("User {} authenticated in WebSocket", user.getUsername());
            sendSuccessMessage(session, user.getUsername());

            return true;
        } catch (Exception e) {
            logger.info("Authentication failed with token: {}", token);
            sendErrorMessage(session, "Invalid token");
            return false;
        }
    }

    private static void sendErrorMessage(Session session, String message) {
        try {
            session.getBasicRemote().sendText("{ \"type\": \"AUTH_FAILED\", \"message\": \"" + message + "\" }");
            session.close();
        } catch (IOException e) {
            logger.error("Failed to close session after authentication failure", e);
        }
    }

    private static void sendSuccessMessage(Session session, String username) {
        try {
            session.getBasicRemote().sendText("{ \"type\": \"AUTHENTICATED\", \"username\": \"" + username + "\" }");
        } catch (IOException e) {
            logger.error("Failed to send authentication success message", e);
        }
    }
}