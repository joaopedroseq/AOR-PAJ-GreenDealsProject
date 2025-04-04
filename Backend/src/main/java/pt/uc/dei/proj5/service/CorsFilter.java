package pt.uc.dei.proj5.service;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Provider
public class CorsFilter implements ContainerResponseFilter {
    private static final Logger logger = LogManager.getLogger(CorsFilter.class);

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        // Add the required CORS headers
        String origin = requestContext.getHeaderString("Origin");
        if ("https://127.0.0.1:5502".equals(origin) || "https://localhost:3000".equals(origin)) {
            responseContext.getHeaders().add("Access-Control-Allow-Origin", origin);
        }
        responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        responseContext.getHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization, token, password, username");
        responseContext.getHeaders().add("Access-Control-Allow-Credentials", "true");

        // Explicitly handle preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
            responseContext.setStatus(200); // Return HTTP 200 OK for OPTIONS
        }
    }
}




