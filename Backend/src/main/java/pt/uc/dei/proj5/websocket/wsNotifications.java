package pt.uc.dei.proj5.websocket;

import jakarta.ejb.Schedule;
import jakarta.ejb.Singleton;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.NotificationBean;
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.dto.*;

import java.io.IOException;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Singleton
@ServerEndpoint("/websocket/notifications/")
public class wsNotifications {
    private static final Logger logger = LogManager.getLogger(wsNotifications.class);
    private HashMap<String, Set<Session>> sessions = new HashMap<>();


    @Inject
    TokenBean tokenBean;

    @Inject
    NotificationBean notificationBean;


    @OnClose
    public void onClose(Session session, CloseReason reason) {
        String username = WebSocketAuthentication.findUsernameBySession(sessions, session);

        if (username != null) {
            Set<Session> userSessions = sessions.get(username);
            if (userSessions != null) {
                userSessions.remove(session); // Remove only this session
                if (userSessions.isEmpty()) {
                    sessions.remove(username); // Remove user if no active sessions remain
                }
            }
            logger.info("User {} disconnected from chat. Reason: {}", username, reason.getReasonPhrase());
        } else {
            logger.info("Unknown WebSocket session closed: {}", reason.getReasonPhrase());
        }
    }

    //Quando o servidor recebe uma mensagem...
    @OnMessage
    public void toDoOnMessage(Session session, String msg) throws IOException {
        JsonReader jsonReader = Json.createReader(new StringReader(msg));
        JsonObject jsonMessage = jsonReader.readObject();
        String messageType = jsonMessage.getString("type");
        switch (messageType) {
            case "AUTHENTICATION": {
                if (WebSocketAuthentication.authenticate(session, jsonMessage, tokenBean, sessions)) {
                    UserDto user = new UserDto();
                    user.setUsername(WebSocketAuthentication.findUsernameBySession(sessions, session));
                    int notificationsCount = notificationBean.getTotalNotifications(user);
                    JsonObject notificationsJSON = Json.createObjectBuilder()
                            .add("type", "NOTIFICATION_COUNT")
                            .add("count", notificationsCount)
                            .build();
                    session.getBasicRemote().sendText(notificationsJSON.toString());
                }
                break;
            }
            default:
                logger.info("Received unknown message type: " + messageType);
        }
    }

    public boolean notifyUser(NotificationDto notificationDto) throws Exception {
        try {
            JsonObject notificationsJson = JsonCreator.createJson(notificationDto.getType().toString().toUpperCase(), "notification", notificationDto);
            String notificationJsonString = notificationsJson.toString();
            if(sendNotificationToUserSessions(notificationDto.getRecipientUsername(), notificationJsonString)){
                return true;
            }
            else {
                return false;
            }
        } catch (Exception e) {
            logger.error("Error while creating JSON object", e);
              return false;
        }
    }

    private boolean sendNotificationToUserSessions(String recipientUsername, String notification) throws Exception {
        try {
            Set<Session> recipientSessions = sessions.get(recipientUsername);
            if(recipientSessions != null && !recipientSessions.isEmpty()) {
                for (Session session : recipientSessions) {
                    if (session.isOpen()) {
                        session.getBasicRemote().sendText(notification);
                    }
                }
                return true;
            }
            else {
                return false;
            }

        } catch (IOException e) {
            logger.error("Failed to send notification to user {}", recipientUsername, e);
            return false;
        }
    }


    @OnMessage
    public void handlePing(Session session, PongMessage pongMessage) {
        logger.info("Received WebSocket PONG from session {}: {}", session.getId(), pongMessage);
    }

    @Schedule(second = "*/60", minute = "*", hour = "*")
    private void pingUsers() {
        for (Set<Session> userSessions : sessions.values()) { // Iterate over session sets
            for (Session session : userSessions) { // Iterate over individual sessions
                if (session.isOpen()) {
                    try {
                        session.getBasicRemote().sendPing(ByteBuffer.wrap(new byte[0])); // Send WebSocket PING frame
                    } catch (IOException e) {
                        logger.error("Failed to send WebSocket PING to session {}", session.getId(), e);
                    }
                }
            }
        }
    }
}