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
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.beans.UserBean;
import pt.uc.dei.proj5.dto.*;

import java.io.IOException;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.time.LocalDateTime;
import java.util.HashMap;



@Singleton
@ServerEndpoint("/websocket/chat/")
public class wsChat {
    private static final Logger logger = LogManager.getLogger(wsChat.class);
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
        logger.info("Received message: {}", msg);
        JsonReader jsonReader = Json.createReader(new StringReader(msg));
        JsonObject jsonMessage = jsonReader.readObject();
        String messageType = jsonMessage.getString("type");
        switch (messageType) {
            case "AUTHENTICATION": {
                WebSocketAuthentication.authenticate(session, jsonMessage, tokenBean, sessions, sessionUser);
                break;
            }
            case "MESSAGE": {
                if (!checkIfValidMessage(jsonMessage)) {
                    session.getBasicRemote().sendText("{ \"type\": \"ERROR\", \"message\": \"Invalid message format\" }");
                } else {
                    String recipient = jsonMessage.getString("recipient").trim();
                    String message = jsonMessage.getString("message").trim();
                    String sender = sessionUser.get(session.getId());
                    if (sender == null) {
                        session.close();
                        return;
                    }
                    if(userBean.checkIfUserExists(recipient)){
                        JsonObject messageJson = archiveNewMessage(message, sender, recipient);
                        Session recipientSession = sessions.get(recipient);
                        if (recipientSession != null && recipientSession.isOpen()) {
                            recipientSession.getBasicRemote().sendText(messageJson.toString());
                            session.getBasicRemote().sendText("{ \"type\": \"SUCCESS\", \"message\": \"Sent message\" }");
                        }
                    }
                    else {
                        logger.info("Recipient {} does not exist", recipient);
                        session.getBasicRemote().sendText("{ \"type\": \"ERROR\", \"message\": \"User recipient does not exist\" }");
                    }
                    }
            }
            default:
                logger.info("Received unknown message type: " + messageType);
        }
    }

    @OnMessage
    public void handlePing(Session session, PongMessage pongMessage) {
        logger.info("Received WebSocket PONG from session {}: {}", session.getId(), pongMessage);
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