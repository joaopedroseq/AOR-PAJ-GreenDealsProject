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
    MessageBean messageBean;

    @Inject
    UserBean userBean;

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
                    String username = sessionUser.get(session.getId());
                    List<MessageNotificationDto> messageNotifications = messageBean.getMessagesNotificationsForUser(username);
                    JsonObject messageNotificationsJSON = buildMessageNotificationJSON(messageNotifications);
                    session.getBasicRemote().sendText(messageNotificationsJSON.toString());
                }
                break;
            }
            case "NOTIFICATION": {

            }
            default:
                logger.info("Received unknown message type: " + messageType);
        }
    }

    @OnMessage
    public void handlePing(Session session, PongMessage pongMessage) {
        logger.info("Received WebSocket PONG from session {}: {}", session.getId(), pongMessage);
    }

    private JsonObject buildMessageNotificationJSON(List<MessageNotificationDto> messageNotifications) {
        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();

        for (MessageNotificationDto messageNotificationDto : messageNotifications) {
            jsonArrayBuilder.add(Json.createObjectBuilder()
                    .add("senderUsername", messageNotificationDto.getSenderUsername())
                    .add("senderPhoto", messageNotificationDto.getSenderPhoto())
                    .add("unreadCount", messageNotificationDto.getUnreadCount())
                    .add("latestMessageTimestamp", messageNotificationDto.getLatestMessageTimestamp().toString()));
        }

        return Json.createObjectBuilder()
                .add("messageNotifications", jsonArrayBuilder)
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