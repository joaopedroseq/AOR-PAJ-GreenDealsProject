package pt.uc.dei.proj3.service;

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import pt.uc.dei.proj3.beans.ApplicationBean;

@Path("/products")
public class ProductService {

    @Inject
    ApplicationBean applicationBean;

    @GET
    @Path("/products")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProducts() {
        if (applicationBean.getProductsAllUsers() != null) {
            return Response.status(200).entity(applicationBean.getProductsAllUsers()).build();
        } else {
            return Response.status(400).entity("Failed").build();
        }
    }
}
