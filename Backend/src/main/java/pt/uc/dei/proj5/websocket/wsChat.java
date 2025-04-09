package pt.uc.dei.proj5.websocket;

import jakarta.ejb.Schedule;
import jakarta.ejb.Singleton;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.MessageBean;
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.beans.UserBean;
import pt.uc.dei.proj5.dto.MessageDto;
import pt.uc.dei.proj5.dto.TokenDto;
import pt.uc.dei.proj5.dto.TokenType;
import pt.uc.dei.proj5.dto.UserDto;

import java.io.IOException;
import java.io.StringReader;
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
    UserBean userBean;

    @Inject
    MessageBean messageBean;


    public void send(String token, String msg) {
        Session session = sessions.get(token);
        if (session != null) {
            System.out.println("sending.......... " + msg);
            try {
                session.getBasicRemote().sendText(msg);
            } catch (IOException e) {
                System.out.println("Something went wrong!");
            }
        }
    }

    @OnOpen
    public void toDoOnOpen(Session session, @PathParam("token") String token) {
        System.out.println("A new WebSocket session is opened for client with token: " + token);
        System.out.println("session" + session);
        try {
            TokenDto tokenDto = new TokenDto();
            tokenDto.setAuthenticationToken(token);
            UserDto user = tokenBean.checkToken(tokenDto, TokenType.AUTHENTICATION);
            sessions.put(user.getUsername(), session);
        } catch (Exception e) {
            System.out.println("Invalid token");
        }
    }

    @OnClose
    public void toDoOnClose(Session session, CloseReason reason) {
        System.out.println("Websocket session is closed with CloseCode: " +
                reason.getCloseCode() + ": " + reason.getReasonPhrase());
        for (String key : sessions.keySet()) {
            if (sessions.get(key) == session)
                sessions.remove(key);
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
                authenticateConnection(session, jsonMessage);
                break;
            }
            case "PONG": {
                break;
            }
            case "MESSAGE": {
                if (!checkIfValidMessage(jsonMessage)) {
                    session.getBasicRemote().sendText("{ \"type\": \"ERROR\", \"message\": \"Invalid message format\" }");
                } else {
                    String receiver = jsonMessage.getString("receiver").trim();
                    String message = jsonMessage.getString("message").trim();
                    String sender = sessionUser.get(session.getId());
                    if (sender == null) {
                        session.close();
                        return;
                    }
                    JsonObject messageJson = archiveNewMessage(message, sender, receiver);
                    Session receiverSession = sessions.get(receiver);
                    if (receiverSession != null || receiverSession.isOpen()) {
                        receiverSession.getBasicRemote().sendText(messageJson.toString());
                    }
                }
            }
            default: logger.info("Received unknown message type: " + messageType);
        }
    }

    private void authenticateConnection(Session session, JsonObject jsonMessage) {
        try {
            String token = jsonMessage.getString("token");
                try {
                    TokenDto tokenDto = new TokenDto();
                    tokenDto.setAuthenticationToken(token);
                    UserDto user = tokenBean.checkToken(tokenDto, TokenType.AUTHENTICATION);
                    sessions.put(user.getUsername(), session);
                    sessionUser.put(session.getId(), user.getUsername());
                    logger.info("User {} authenticated in chat", user.getUsername());
                    // Send confirmation message to frontend
                    session.getBasicRemote().sendText("{ \"type\": \"AUTHENTICATED\", \"username\": \"" + user.getUsername() + "\" }");
                } catch (Exception e) {
                    logger.info("Authentication failed with token: " + token);
                    try {
                        session.getBasicRemote().sendText("{ \"type\": \"AUTH_FAILED\", \"message\": \"Invalid token\" }");
                        session.close();
                    } catch (IOException ex) {
                        logger.info("Session failed to close with token: " + token);
                    }
                }
        } catch (Exception e) {
            System.out.println("Not an authentication");
        }
    }


    private JsonObject archiveNewMessage(String message, String sender, String receiver) {
        LocalDateTime timestamp = LocalDateTime.now();
        MessageDto messageDto = new MessageDto(message, sender, receiver, timestamp);

        if (messageBean.newMessage(messageDto)) {
            return Json.createObjectBuilder()
                    .add("type", "MESSAGE")
                    .add("sender", sender)
                    .add("receiver", receiver)
                    .add("message", message)
                    .add("timestamp", timestamp.toString())
                    .build();
        }

        return Json.createObjectBuilder()
                .add("type", "ERROR")
                .add("message", "Message failed to archive")
                .build();
    }

    private boolean checkIfValidMessage (JsonObject jsonMessage) {
        if (jsonMessage.containsKey("receiver") && jsonMessage.containsKey("message")) {
            return true;
        }
        return false;
    }

    @Schedule(second = "*/30", minute = "*", hour = "*")
    private void pingUsers() {
        for (Session session : sessions.values()) {
            if (session.isOpen()) {
                try {
                    session.getBasicRemote().sendText("{ \"type\": \"PING\" }");
                } catch (IOException e) {
                    System.out.println("Failed to send ping: " + e.getMessage());
                }
            }
        }
    }

}