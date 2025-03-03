package pt.uc.dei.proj3.service;

import jakarta.ws.rs.OPTIONS;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/")
public class OptionsEndpoint {

    @OPTIONS
    public Response optionsHandler() {
        return Response.ok()
                .header("Access-Control-Allow-Origin", "http://127.0.0.1:5502")
                .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Authorization, token, password, username")
                .header("Access-Control-Allow-Credentials", "true")
                .build();
    }
}

