package pt.uc.dei.proj3.service;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

@Provider
public class CorsFilter implements ContainerResponseFilter {
    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        // Add the required CORS headers
        responseContext.getHeaders().add("Access-Control-Allow-Origin", "http://127.0.0.1:5502");
        responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        responseContext.getHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization, token, password, username");
        responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");

        // Explicitly handle preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
            responseContext.setStatus(200); // Return HTTP 200 OK for OPTIONS
        }
    }
}




