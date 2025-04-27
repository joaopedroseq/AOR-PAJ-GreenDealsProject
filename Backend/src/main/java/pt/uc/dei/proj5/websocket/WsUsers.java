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

/**
 * Endpoint WebSocket que gerencia conexões de usuários e comunicação.
 * Esta classe lida com eventos WebSocket, como abertura/fechamento de conexões,
 * manipulação de mensagens, e também realiza o broadcast de atualizações relacionadas ao usuário.
 */
@Singleton
@ServerEndpoint("/websocket/users/")
public class WsUsers {
    private static final Logger logger = LogManager.getLogger(WsUsers.class);
    private Set<Session> sessions = new HashSet<>();

    /**
     * Executado quando uma nova conexão WebSocket é aberta.
     *
     * @param session A sessão WebSocket representando a conexão do cliente.
     */
    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        logger.info("Nova conexão: sessão {}", session.getId());
    }

    /**
     * Executado quando uma conexão WebSocket é fechada.
     *
     * @param session A sessão WebSocket representando a conexão do cliente.
     * @param reason O motivo pelo qual a conexão foi encerrada.
     */
    @OnClose
    public void onClose(Session session, CloseReason reason) {
        sessions.remove(session);
        logger.info("Sessão {} desconectada: {}", session.getId(), reason.getReasonPhrase());
    }

    /**
     * Envia uma atualização de usuário (em formato JSON) para todas as sessões WebSocket ativas.
     *
     * @param userDto Os dados do usuário que serão enviados no broadcast.
     * @param type O tipo da atualização (por exemplo: "adicionar", "atualizar").
     */
    public void broadcastUser(UserDto userDto, String type) {
        JsonObject userJson = JsonCreator.createJson(type, "user", userDto);
        if (userJson != null) {
            String userJsonString = userJson.toString(); // Converter uma vez e reutilizar
            // Envia as atualizações para todas as sessões ativas
            for (Session session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.getBasicRemote().sendText(userJsonString);
                    } catch (IOException e) {
                        logger.error("Falha ao enviar atualização do usuário para a sessão {}", session.getId(), e);
                    }
                }
            }
        } else {
            logger.info("Nenhuma atualização de produto encontrada para enviar.");
        }
    }

    /**
     * Manipula mensagens PONG recebidas do cliente WebSocket.
     * Este método registra no log as mensagens PONG para fins de depuração.
     *
     * @param session A sessão WebSocket que enviou a mensagem PONG.
     * @param pongMessage A mensagem PONG recebida.
     */
    @OnMessage
    public void handlePing(Session session, PongMessage pongMessage) {
        logger.info("PONG recebido da sessão {}: {}", session.getId(), pongMessage);
    }

    /**
     * Envia periodicamente uma mensagem de PING para todas as sessões WebSocket ativas.
     * Este método é acionado a cada 60 segundos para verificar a atividade das sessões.
     */
    @Schedule(second = "*/60", minute = "*", hour = "*")
    private void pingUsers() {
        for (Session session : sessions) {
            if (session.isOpen()) {
                try {
                    session.getBasicRemote().sendPing(ByteBuffer.wrap(new byte[0]));
                } catch (IOException e) {
                    logger.error("Falha ao enviar PING para a sessão {}", session.getId(), e);
                }
            }
        }
    }
}
