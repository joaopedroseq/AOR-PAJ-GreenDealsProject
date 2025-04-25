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
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
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
                                       TokenBean tokenBean, HashMap<String, Set<Session>> sessions) {
        if (!jsonMessage.containsKey("token") || jsonMessage.isNull("token")) {
            sendErrorMessage(session, "Missing authentication token");
            return false;
        }
        String token = jsonMessage.getString("token");
        TokenDto tokenDto = new TokenDto();
        tokenDto.setTokenValue(token);

        try {
            UserDto user = tokenBean.checkToken(tokenDto);
            if(user == null) {
                logger.error("Invalid authentication token");
                sendErrorMessage(session, "Invalid authentication token");
                return false;
            }
            if (user.getState().equals(UserAccountState.EXCLUDED) || user.getState().equals(UserAccountState.INACTIVE)) {
                logger.info("Authentication failed: User {} has inactive or excluded account", user.getUsername());
                sendErrorMessage(session, "Excluded or inactive user");
                return false;
            }
            sessions.computeIfAbsent(user.getUsername(), k -> new HashSet<>()).add(session);
            logger.info("User {} authenticated in WebSocket", user.getUsername());
            sendSuccessMessage(session, user.getUsername());
            return true;
        }
        catch (Exception e) {
            logger.error("Authentication failed", e);
            sendErrorMessage(session, e.getMessage());
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

    private static void sendInfoMessage(Session session, String message) {
        try {
            session.getBasicRemote().sendText("{ \"type\": \"AUTH_INFO\", \"message\": \"" + message + "\" }");
        } catch (IOException e) {
            logger.error("Failed to inform user", e);
        }
    }

    private static void sendSuccessMessage(Session session, String username) {
        try {
            session.getBasicRemote().sendText("{ \"type\": \"AUTHENTICATED\", \"username\": \"" + username + "\" }");
        } catch (IOException e) {
            logger.error("Failed to send authentication success message", e);
        }
    }

    public static String findUsernameBySession(HashMap<String, Set<Session>> sessions, Session session) {
        for (Map.Entry<String, Set<Session>> entry : sessions.entrySet()) {
            if (entry.getValue().contains(session)) {
                return entry.getKey(); // Return the username associated with the session
            }
        }
        return null; // Return null if no match found
    }

}