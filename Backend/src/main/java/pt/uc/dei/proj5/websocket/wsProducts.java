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
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.dto.JsonCreate;
import pt.uc.dei.proj5.dto.ProductDto;

import java.io.IOException;
import java.io.StringReader;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

@Singleton
@ServerEndpoint("/websocket/products/")
public class wsProducts {
    private static final Logger logger = LogManager.getLogger(wsProducts.class);
    private Set<Session> sessions = new HashSet<>(); // Store all sessions

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

    public void broadcastProduct(ProductDto productDto, String type) {
        System.out.println(productDto);
        JsonObject productJson = JsonCreate.createJson(type, "product", productDto);
        if (productJson != null) {
            String productJsonString = productJson.toString();
            for (Session session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.getBasicRemote().sendText(productJsonString);
                    } catch (IOException e) {
                        logger.error("Failed to send product update to session {}", session.getId(), e);
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