package pt.uc.dei.proj5.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.ConfigurationBean;
import pt.uc.dei.proj5.beans.TokenBean;
import pt.uc.dei.proj5.dto.*;

@Path("/configuration")
public class ConfigurationService {
    private static final Logger logger = LogManager.getLogger(ConfigurationService.class);

    @Inject
    TokenBean tokenBean;

    @Inject
    ConfigurationBean configurationBean;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLatestConfiguration() {
        ConfigurationDto latestConfiguration = configurationBean.getLatestConfiguration();
        logger.info("Latest configuration requested");
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
        UserDto user = tokenBean.checkToken(tokenDto, TokenType.AUTHENTICATION);
        if (user == null) {
            logger.error("Invalid token - adding new configuration");
            return Response.status(401).entity("Invalid token").build();
        }
        if (user.getState() == UserAccountState.INACTIVE || user.getState() == UserAccountState.EXCLUDED) {
            logger.error("Permission denied - user {} tried to add new configuration with inactive or excluded account", user.getUsername());
            return Response.status(403).entity("User has inactive or excluded account").build();
        }
        if (user.getAdmin() == false){
            logger.error("Permission denied - adding new configuration by {} without admin privileges", user.getUsername());
            return Response.status(403).entity("Permission denied").build();
        }
        configurationDto.setAdminUsername(user.getUsername());
        if(configurationBean.createNewConfiguration(configurationDto)) {
            configurationDto = configurationBean.getLatestConfiguration();
            logger.info("Admin {} added new configuration settings {}", user.getUsername(), configurationDto);
            return Response.status(200).entity(configurationDto).build();
        }
        else {
            logger.error("Failed to add new configuration settings {}", configurationDto);
            return Response.status(404).entity("Failed to add new configuration settings").build();
        }
    }
}