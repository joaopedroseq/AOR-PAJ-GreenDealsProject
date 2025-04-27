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

@Path("/stats")
public class StatisticsService {
    private static final Logger logger = LogManager.getLogger(StatisticsService.class);

    @Inject
    StatisticsBean statisticsBean;

    @Inject
    AuthenticationService authenticationService;

    @GET
    @Path("/product")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductStatistics(@HeaderParam("token") String authenticationToken) {
        UserDto user;
        try {
            user = authenticationService.validateAuthenticationToken(authenticationToken);
        } catch (WebApplicationException e) {
            return e.getResponse();
        }// Directly return HTTP response
        if (!user.getAdmin()) {
            logger.info("Permission denied - user {} tried to get stats without admin privileges", user.getUsername());
            return Response.status(403).entity("Permission denied").build();
        }
        else {
            ProductStatisticsDto productStatistics = statisticsBean.getProductStatistics();
            return Response.status(200).entity(productStatistics).build();
        }
    }


}
