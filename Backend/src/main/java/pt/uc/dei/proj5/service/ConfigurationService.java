package pt.uc.dei.proj5.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.ConfigurationBean;
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.dto.ConfigurationDto;
import pt.uc.dei.proj5.dto.TokenDto;
import pt.uc.dei.proj5.dto.TokenType;
import pt.uc.dei.proj5.dto.UserDto;

@Path("/configuration")
public class ConfigurationService {
    private static final Logger logger = LogManager.getLogger(ConfigurationService.class);

    @Inject
    TokenBean tokenBean;

    @Inject
    ConfigurationBean configurationBean;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLatestConfiguration(@HeaderParam("token") String authenticationToken) {
        if (authenticationToken == null || authenticationToken.trim().isEmpty()) {
            logger.error("No token - get the latest configuration");
            return Response.status(401).entity("Missing token").build();
        }
        TokenDto tokenDto = new TokenDto();
        tokenDto.setAuthenticationToken(authenticationToken);
        UserDto requester = tokenBean.checkToken(tokenDto, TokenType.AUTHENTICATION);
        if (requester == null) {
            logger.error("Invalid token - get the latest configuration");
            return Response.status(401).entity("Invalid token").build();
        }
        //Implemetar bloqueio de contas excluídas
        if (requester.getAdmin() == false){
            logger.error("Permission denied - getting latest configuration by {} without admin privileges", requester.getUsername());
            return Response.status(403).entity("Permission denied").build();
        }
        ConfigurationDto latestConfiguration = configurationBean.getLatestConfiguration();
        logger.info("Admin {} requested latest configuration settings", requester.getUsername());
        return Response.status(200).entity(latestConfiguration).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addNewConfiguration(@HeaderParam("token") String authenticationToken, ConfigurationDto configurationDto) {
        if (authenticationToken == null || authenticationToken.trim().isEmpty()) {
            logger.error("No token - implementing new configuration");
            return Response.status(401).entity("Missing token").build();
        }
        TokenDto tokenDto = new TokenDto();
        tokenDto.setAuthenticationToken(authenticationToken);
        UserDto requester = tokenBean.checkToken(tokenDto, TokenType.AUTHENTICATION);
        if (requester == null) {
            logger.error("Invalid token - adding new configuration");
            return Response.status(401).entity("Invalid token").build();
        }
        //IMplemetar bloqueio de contas excluídas
        if (requester.getAdmin() == false){
            logger.error("Permission denied - adding new configuration by {} without admin privileges", requester.getUsername());
            return Response.status(403).entity("Permission denied").build();
        }
        configurationDto.setAdminUsername(requester.getUsername());
        if(configurationBean.createNewConfiguration(configurationDto)) {
            logger.info("Admin {} added new configuration settings {}", requester.getUsername(), configurationDto);
            return Response.status(200).entity(configurationDto).build();
        }
        else {
            logger.error("Failed to add new configuration settings {}", configurationDto);
            return Response.status(404).entity("Failed to add new configuration settings").build();
        }
    }
}