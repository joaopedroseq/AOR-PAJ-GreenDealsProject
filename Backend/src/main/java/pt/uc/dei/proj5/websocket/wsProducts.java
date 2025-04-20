package pt.uc.dei.proj5.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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
import pt.uc.dei.proj5.dto.ProductDto;

import java.io.IOException;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.util.HashMap;

@Singleton
@ServerEndpoint("/websocket/products/")
public class wsProducts {
    private static final Logger logger = LogManager.getLogger(wsProducts.class);
    private HashMap<String, Session> sessions = new HashMap<String, Session>();
    private HashMap<String, String> sessionUser = new HashMap<>();

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
        String username = sessionUser.remove(session.getId()); // Remove mapping for session ID
        if (username != null) {
            sessions.remove(username); // Remove session entry
            logger.info("User {} disconnected from chat. Reason: {}", username, reason.getReasonPhrase());
        } else {
            logger.info("Unknown WebSocket session closed: {}", reason.getReasonPhrase());
        }
    }

    @OnMessage
    public void toDoOnMessage(Session session, String msg) throws IOException {
        JsonReader jsonReader = Json.createReader(new StringReader(msg));
        JsonObject jsonMessage = jsonReader.readObject();
        String messageType = jsonMessage.getString("type");
        switch (messageType) {
            case "AUTHENTICATION": {
                WebSocketAuthentication.authenticate(session, jsonMessage, tokenBean, sessions, sessionUser);
                break;
            }
            default:
                logger.info("Received unknown message type: " + messageType);
        }
    }

    public void broadcastProduct(ProductDto productDto, String type) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, true);
            String productJson = "{"
                    + "\"type\": \"" + type + "\","
                    + "\"product\": " + objectMapper.writeValueAsString(productDto)
                    + "}";
            for(Session session : sessions.values()) {
                if(session.isOpen()) {
                    try {
                        session.getBasicRemote().sendText(productJson);
                    }
                    catch (IOException e) {
                        logger.error("Failed to send product: " + productJson, e);
                    }
                }
            }
        }
        catch (JsonProcessingException e) {
            logger.error("Failed to build object: " + e);
        }
    }

    @OnMessage
    public void handlePing(Session session, PongMessage pongMessage) {
        logger.info("Received WebSocket PONG from session {}: {}", session.getId(), pongMessage);
    }

    private boolean checkIfValidNewProduct(JsonObject jsonProduct) {
        return jsonProduct.containsKey("recipient") &&
                jsonProduct.containsKey("message") &&
                jsonProduct.get("recipient") != null &&
                jsonProduct.get("message") != null &&
                jsonProduct.getString("recipient") != null &&
                jsonProduct.getString("message") != null &&
                !jsonProduct.getString("recipient").trim().isEmpty() &&
                !jsonProduct.getString("message").trim().isEmpty();
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