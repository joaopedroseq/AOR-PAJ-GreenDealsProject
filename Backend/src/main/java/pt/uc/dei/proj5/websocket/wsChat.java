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
import java.util.Set;


@Singleton
@ServerEndpoint("/websocket/chat/")
public class wsChat {
    private static final Logger logger = LogManager.getLogger(wsChat.class);
    private HashMap<String, Set<Session>> sessions = new HashMap<>();

    @Inject
    TokenBean tokenBean;

    @Inject
    MessageBean messageBean;

    @Inject
    NotificationBean notificationBean;

    @Inject
    UserBean userBean;

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
                WebSocketAuthentication.authenticate(session, jsonMessage, tokenBean, sessions);
                break;
            }
            case "MESSAGE": {
                if (!checkIfValidMessage(jsonMessage)) {
                    session.getBasicRemote().sendText(JsonCreator.createJson("ERROR", "message", "Invalid message format").toString());
                } else {
                    String recipient = jsonMessage.getString("recipient").trim();
                    String message = jsonMessage.getString("message").trim();
                    String sender = WebSocketAuthentication.findUsernameBySession(sessions, session);
                    if (sender == null) {
                        session.close();
                        return;
                    }
                    if (userBean.checkIfUserExists(recipient)) {
                        JsonObject messageJson = archiveNewMessage(message, sender, recipient);
                        Set<Session> recipientSessions = sessions.get(recipient);
                        if (recipientSessions != null) {
                            for (Session recipientSession : recipientSessions) {
                                if (recipientSession.isOpen()) {
                                    recipientSession.getBasicRemote().sendText(messageJson.toString());
                                }
                            }
                            JsonObject confirmationJson = JsonCreator.createJson("SUCESS", "message", new String("Sent message sucessfully"));
                            session.getBasicRemote().sendText(confirmationJson.toString());
                        } else {
                            notificationBean.newMessageNotification(message, sender, recipient);
                        }
                    } else {
                        logger.info("Recipient {} does not exist", recipient);
                        JsonObject errorJson = JsonCreator.createJson("ERROR", "message", new String("User recipient does not exist"));
                        session.getBasicRemote().sendText(errorJson.toString());
                    }
                }
            }
            default:
                logger.info("Received unknown message type: " + messageType);
        }
    }

    private JsonObject archiveNewMessage(String message, String sender, String recipient) {
        LocalDateTime timestamp = LocalDateTime.now();
        MessageDto messageDto = new MessageDto(message, sender, recipient, timestamp);

        if (messageBean.newMessage(messageDto)) {
            return Json.createObjectBuilder()
                    .add("type", "MESSAGE")
                    .add("sender", sender)
                    .add("recipient", recipient)
                    .add("message", message)
                    .add("timestamp", timestamp.toString())
                    .build();
        }

        return Json.createObjectBuilder()
                .add("type", "ERROR")
                .add("message", "Message failed to archive")
                .build();
    }

    private boolean checkIfValidMessage(JsonObject jsonMessage) {
        return jsonMessage.containsKey("recipient") &&
                jsonMessage.containsKey("message") &&
                jsonMessage.get("recipient") != null &&
                jsonMessage.get("message") != null &&
                jsonMessage.getString("recipient") != null &&
                jsonMessage.getString("message") != null &&
                !jsonMessage.getString("recipient").trim().isEmpty() &&
                !jsonMessage.getString("message").trim().isEmpty();
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