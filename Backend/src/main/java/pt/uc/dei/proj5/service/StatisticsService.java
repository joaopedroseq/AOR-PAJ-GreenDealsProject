package pt.uc.dei.proj5.service;


import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.ProductBean;
import pt.uc.dei.proj5.beans.StatisticsBean;
import pt.uc.dei.proj5.dto.ProductStatisticsDto;
import pt.uc.dei.proj5.dto.UserDto;
import pt.uc.dei.proj5.dto.UserStatisticsDto;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.dto.*;
import pt.uc.dei.proj5.beans.*;

/**
 * Serviço REST responsável por fornecer estatísticas do sistema.
 * As operações envolvem recuperação de estatísticas relacionadas a produtos e usuários.
 * Somente administradores têm permissão para acessar esses endpoints.
 */
@Path("/stats")
public class StatisticsService {

    private static final Logger logger = LogManager.getLogger(StatisticsService.class);

    @Inject
    private StatisticsBean statisticsBean;

    @Inject
    private AuthenticationService authenticationService;

    /**
     * Recupera as estatísticas relacionadas aos produtos no sistema.
     *
     * @param authenticationToken Token de autenticação para verificar os privilégios do usuário.
     * @return Response contendo as estatísticas de produtos ou uma mensagem de erro (se a operação falhar).
     */
    @GET
    @Path("/product")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductStatistics(@HeaderParam("token") String authenticationToken) {
        // Valida o token de autenticação do usuário
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse(); // Retorna a resposta de erro diretamente
        }

        // Verifica se o usuário tem permissões de administrador
        if (!user.getAdmin()) {
            logger.info("Permission denied - user {} tried to get product stats without admin privileges",
                    user.getUsername());
            return Response.status(403).entity("Permission denied").build();
        } else {
            // Busca as estatísticas de produto
            ProductStatisticsDto productStatistics = statisticsBean.getProductStatistics();
            logger.info("User {} successfully retrieved product statistics", user.getUsername());
            return Response.status(200).entity(productStatistics).build();
        }
    }

    /**
     * Recupera as estatísticas relacionadas aos usuários no sistema.
     *
     * @param authenticationToken Token de autenticação para verificar os privilégios do usuário.
     * @return Response contendo as estatísticas dos usuários ou uma mensagem de erro (se a operação falhar).
     */
    @GET
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserStatistics(@HeaderParam("token") String authenticationToken) {
        // Valida o token de autenticação do usuário
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse(); // Retorna a resposta de erro diretamente
        }

        // Verifica se o usuário tem permissões de administrador
        if (!user.getAdmin()) {
            logger.info("Permission denied - user {} tried to get user stats without admin privileges",
                    user.getUsername());
            return Response.status(403).entity("Permission denied").build();
        } else {
            // Busca as estatísticas de usuários
            UserStatisticsDto userStatistics = statisticsBean.getUserStatistics();
            logger.info("User {} successfully retrieved user statistics", user.getUsername());
            return Response.status(200).entity(userStatistics).build();
        }
    }
}