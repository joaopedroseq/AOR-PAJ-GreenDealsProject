package pt.uc.dei.proj5.service;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj5.beans.ConfigurationBean;
import pt.uc.dei.proj5.dto.*;

@Path("/configuration")
public class ConfigurationService {
    private static final Logger logger = LogManager.getLogger(ConfigurationService.class);

    @Inject
    AuthenticationService authenticationService;

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
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
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