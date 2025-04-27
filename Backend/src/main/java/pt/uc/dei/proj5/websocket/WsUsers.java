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
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.dto.JsonCreator;
import pt.uc.dei.proj5.dto.UserDto;

import java.io.IOException;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

@Singleton
@ServerEndpoint("/websocket/users/")
public class WsUsers {
    private static final Logger logger = LogManager.getLogger(WsUsers.class);
    private Set<Session> sessions = new HashSet<>();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        logger.info("New connection: session {}", session.getId());
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
        sessions.remove(session);
        logger.info("Session {} disconnected: {}", session.getId(), reason.getReasonPhrase());
    }

    public void broadcastUser(UserDto userDto, String type) {
        JsonObject userJson = JsonCreator.createJson(type, "user", userDto);
        if (userJson != null) {
            String userJsonString = userJson.toString(); // Convert once
            // Send product update to all active sessions
            for (Session session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.getBasicRemote().sendText(userJsonString);
                    } catch (IOException e) {
                        logger.error("Failed to send user update to session {}", session.getId(), e);
                    }
                }
            }
        } else {
            logger.info("No product to update");
        }
    }

    @OnMessage
    public void handlePing(Session session, PongMessage pongMessage) {
        logger.info("Received WebSocket PONG from session {}: {}", session.getId(), pongMessage);
    }

    @Schedule(second = "*/60", minute = "*", hour = "*")
    private void pingUsers() {
        for (Session session : sessions) {
            if (session.isOpen()) {
                try {
                    session.getBasicRemote().sendPing(ByteBuffer.wrap(new byte[0]));
                } catch (IOException e) {
                    logger.error("Failed to send WebSocket PING to session {}", session.getId(), e);
                }
            }
        }
    }
}