package pt.uc.dei.proj5.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.dto.JsonCreate;
import pt.uc.dei.proj5.dto.UserDto;

import java.io.IOException;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Set;

@Singleton
@ServerEndpoint("/websocket/users/")
public class WsUsers {
    private static final Logger logger = LogManager.getLogger(WsUsers.class);
    private HashMap<String, Set<Session>> sessions = new HashMap<>();

    @Inject
    TokenBean tokenBean;

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
            default:
                logger.info("Received unknown message type: " + messageType);
        }
    }

    public void broadcastUser(UserDto userDto, String type) {
        JsonObject userJson = JsonCreate.createJson(type, "user", userDto);
        if (userJson != null) {
            String userJsonString = userJson.toString(); // Convert once
            // Send product update to all active sessions
            for (Set<Session> userSessions : sessions.values()) {
                for (Session session : userSessions) {
                    if (session.isOpen()) {
                        try {
                            session.getBasicRemote().sendText(userJsonString);
                        } catch (IOException e) {
                            logger.error("Failed to send user update to session {}", session.getId(), e);
                        }
                    }
                }
            }
        }
        else {
            logger.info("No product to update");
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