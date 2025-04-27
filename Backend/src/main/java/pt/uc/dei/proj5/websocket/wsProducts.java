package pt.uc.dei.proj5.websocket;

import jakarta.ejb.Schedule;
import jakarta.ejb.Singleton;
import jakarta.json.JsonObject;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dto.JsonCreator;
import pt.uc.dei.proj5.dto.ProductDto;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.HashSet;
import java.util.Set;

/**
 * Endpoint WebSocket responsável por gerenciar conexões e comunicação para atualizações de produtos.
 * Esta classe lida com eventos de abertura e fechamento de conexões WebSocket, envio e recepção de mensagens,
 * além de realizar o broadcast de atualizações de produtos para todos os clientes conectados.
 */
@Singleton
@ServerEndpoint("/websocket/products/")
public class wsProducts {

    // Logger para registrar informações sobre conexões e erros
    private static final Logger logger = LogManager.getLogger(wsProducts.class);

    // Armazena todas as sessões WebSocket ativas
    private Set<Session> sessions = new HashSet<>();

    /**
     * Executado quando uma nova conexão WebSocket é aberta.
     * Adiciona a sessão do cliente à lista de sessões ativas e registra a conexão no log.
     *
     * @param session A sessão WebSocket representando a conexão do cliente.
     */
    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session); // Adiciona a nova sessão à lista de sessões
        logger.info("New connection: session {}", session.getId()); // Log da conexão
    }

    /**
     * Executado quando uma conexão WebSocket é fechada.
     * Remove a sessão do cliente da lista de sessões ativas e registra o encerramento no log.
     *
     * @param session A sessão WebSocket que foi desconectada.
     * @param reason O motivo pelo qual a conexão foi encerrada.
     */
    @OnClose
    public void onClose(Session session, CloseReason reason) {
        sessions.remove(session); // Remove a sessão encerrada da lista
        logger.info("Session {} disconnected: {}", session.getId(), reason.getReasonPhrase()); // Log do fechamento
    }

    /**
     * Realiza o envio de uma mensagem de atualização de produto para todos os clientes conectados.
     * A atualização é enviada no formato JSON e o tipo de atualização pode ser especificado
     * (por exemplo: "criar", "atualizar", "deletar").
     *
     * @param productDto Os dados do produto que serão enviados na mensagem.
     * @param type O tipo da ação realizada sobre o produto (exemplo: "add", "update").
     */
    public void broadcastProduct(ProductDto productDto, String type) {
        System.out.println(productDto); // Representação básica para console
        // Cria um objeto JSON contendo as informações do produto
        JsonObject productJson = JsonCreator.createJson(type, "product", productDto);
        if (productJson != null) {
            String productJsonString = productJson.toString(); // Converte o JSON para String para enviar via WebSocket
            // Envia a mensagem para todas as sessões ativas
            for (Session session : sessions) {
                if (session.isOpen()) { // Verifica se a sessão está aberta
                    try {
                        session.getBasicRemote().sendText(productJsonString); // Envia a mensagem
                    } catch (IOException e) {
                        logger.error("Failed to send product update to session {}", session.getId(), e); // Log de erro
                    }
                }
            }
        } else {
            logger.info("No product to update"); // Log quando não há atualização de produto
        }
    }

    /**
     * Executado quando uma mensagem do tipo PONG é recebida de uma sessão WebSocket.
     * Este método é usado para registrar no log que o cliente respondeu a um PING,
     * confirmando que está ativo.
     *
     * @param session A sessão WebSocket que enviou a mensagem PONG.
     * @param pongMessage A mensagem PONG recebida do cliente.
     */
    @OnMessage
    public void handlePing(Session session, PongMessage pongMessage) {
        logger.info("Received WebSocket PONG from session {}: {}", session.getId(), pongMessage); // Log de PONG
    }

    /**
     * Envia mensagens do tipo PING periodicamente para todas as sessões WebSocket ativas.
     * Isto é utilizado para verificar se as conexões dos clientes ainda estão ativas.
     * Caso uma sessão não responda ao PING, a conexão será considerada perdida.
     *
     * Este método é programado para ser executado automaticamente a cada 60 segundos.
     */
    @Schedule(second = "*/60", minute = "*", hour = "*") // Executa a cada 60 segundos (todas as horas e minutos)
    private void pingUsers() {
        for (Session session : sessions) {
            if (session.isOpen()) { // Verifica se a sessão está aberta
                try {
                    session.getBasicRemote().sendPing(ByteBuffer.wrap(new byte[0])); // Envia um PING vazio
                } catch (IOException e) {
                    logger.error("Failed to send WebSocket PING to session {}", session.getId(), e); // Log de erro
                }
            }
        }
    }
}