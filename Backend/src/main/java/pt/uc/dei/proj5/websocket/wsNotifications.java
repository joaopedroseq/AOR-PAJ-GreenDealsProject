package pt.uc.dei.proj5.websocket;

import jakarta.ejb.Schedule;
import jakarta.ejb.Singleton;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.MessageBean;
import pt.uc.dei.proj5.beans.NotificationBean;
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.beans.UserBean;
import pt.uc.dei.proj5.dto.*;

import java.io.IOException;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Singleton
@ServerEndpoint("/websocket/notifications/")
public class wsNotifications {
    private static final Logger logger = LogManager.getLogger(wsNotifications.class);
    private HashMap<String, Session> sessions = new HashMap<String, Session>();
    private HashMap<String, String> sessionUser = new HashMap<>();

    @Inject
    TokenBean tokenBean;

    @Inject
    NotificationBean notificationBean;


    @OnClose
    public void onClose(Session session, CloseReason reason) {
        String username = sessionUser.remove(session.getId()); // Remove mapping for session ID

        if (username != null) {
            sessions.remove(username); // Remove session entry
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
                if (WebSocketAuthentication.authenticate(session, jsonMessage, tokenBean, sessions, sessionUser)) {
                    UserDto user = new UserDto();
                    user.setUsername(sessionUser.get(session.getId()));
                    List<NotificationDto> notifications = notificationBean.getNotifications(user);
                    JsonObject notificationsJSON = buildNotificationJSON(notifications);
                    session.getBasicRemote().sendText(notificationsJSON.toString());
                }
                break;
            }
            case "NOTIFICATION": {

            }
            default:
                logger.info("Received unknown message type: " + messageType);
        }
    }

    public void notifyUser(NotificationDto notificationDto) throws IOException {
        String recipientUsername = notificationDto.getRecipientUsername();
        String senderUsername = notificationDto.getSenderUsername();
        Session recipientSession = sessions.get(recipientUsername);

        if (recipientSession != null && recipientSession.isOpen()) {
            String message = switch (notificationDto.getType()) {
                case MESSAGE -> String.format("You have %d unread messages from %s",
                        notificationDto.getMessageCount(), senderUsername);
                case PRODUCT_ALTERED -> String.format("Admin %s has altered your product", senderUsername);
                case PRODUCT_BOUGHT -> String.format("%s has bought your product", senderUsername);
                default -> "Unknown notification type.";
            };
            recipientSession.getBasicRemote().sendText(message);
        }
    }

    @OnMessage
    public void handlePing(Session session, PongMessage pongMessage) {
        logger.info("Received WebSocket PONG from session {}: {}", session.getId(), pongMessage);
    }

    private JsonObject buildNotificationJSON(List<NotificationDto> notifications) {
        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();

        for (NotificationDto notificationDto : notifications) {
            jsonArrayBuilder.add(Json.createObjectBuilder()
                    .add("id", notificationDto.getId())
                    .add("type", notificationDto.getType().toString())
                    .add("content", notificationDto.getContent())
                    .add("recipientUsername", notificationDto.getRecipientUsername())
                    .add("senderUsername", notificationDto.getSenderUsername())
                    .add("senderProfileUrl", notificationDto.getSenderProfileUrl())
                    .add("messageCount", notificationDto.getMessageCount() != null ? notificationDto.getMessageCount() : 0));
        }

        return Json.createObjectBuilder()
                .add("notificationJSON", jsonArrayBuilder)
                .build();
    }

    @Schedule(second = "*/30", minute = "*", hour = "*")
    private void pingUsers() {
        for (Session session : sessions.values()) {
            if (session.isOpen()) {
                try {
                    session.getBasicRemote().sendPing(ByteBuffer.wrap(new byte[0])); // Sending an actual WebSocket PING frame
                } catch (IOException e) {
                    logger.error("Failed to send WebSocket PING", e);
                }
            }
        }
    }

}