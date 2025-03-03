package pt.uc.dei.proj3.service;

import pt.uc.dei.proj3.beans.ApplicationBean;
import pt.uc.dei.proj3.beans.UserBean;
import pt.uc.dei.proj3.dto.LoginDto;
import pt.uc.dei.proj3.dto.ProductDto;
import pt.uc.dei.proj3.dto.Evaluation;
import pt.uc.dei.proj3.dto.UserDto;
import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import pt.uc.dei.proj3.entity.UserEntity;


@Path("/user")
public class UserService {
    private final Logger logger = LogManager.getLogger(UserService.class);

    @Inject
    UserBean userbean;

    @Inject
    ApplicationBean applicationBean;

    @Context
    private HttpServletRequest request;


    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerUser(UserDto userDto) {
        logger.info("Registering user: " + userDto);
        if (!userDto.isValid()) {
            logger.error("Invalid data - missing params - Registering user");
            return Response.status(400).entity("Invalid data").build();
        }
        if (userbean.registerNormalUser(userDto)) {
            logger.info("Registering user: " + userDto);
            return Response.status(200).entity("The new user is registered").build();
        } else {
            logger.error("Same username conflict - Registering user");
            return Response.status(409).entity("There is a user with the same username!").build();
        }
    }

    @POST
    @Path("/registerAdmin")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerAdmin(UserDto userDto) {
        if (!userDto.isValid()) {
            logger.error("Invalid data - registering new admin {}", userDto.getUsername());
            return Response.status(400).entity("Invalid Data").build();
        }
        if (userbean.registerAdmin(userDto)) {
            logger.info("New admin registered {}", userDto.getUsername());
            return Response.status(200).entity("The new admin is registered").build();
        } else {
            logger.error("Same username conflict - Registering admin {}", userDto.getUsername());
            return Response.status(409).entity("There is a user with the same username!").build();
        }
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(LoginDto user) {
        if (!user.isValid()) {
            logger.error("Invalid data - login from user {}", user.getUsername());
            return Response.status(400).entity("Invalid data").build();
        }
        String token = userbean.login(user);
        if (token == null) {
            logger.error("Login failed from {} - wrong username/password", user.getUsername());
            return Response.status(401).entity("Wrong Username or Password !").build();
        } else {
            logger.info("Login from {} successful", user.getUsername());
            return Response.status(200).entity(token).build();
        }
    }

    @POST
    @Path("/logout")
    public Response logout(@HeaderParam("token") String token) {
        if (userbean.logout(token)) {
            logger.info("Logout successful");
            return Response.status(200).entity("Logout Successful!").build();
        } else {
            logger.error("Logout failed");
            return Response.status(401).entity("Invalid Token!").build();
        }
    }


    @GET
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserLogged(@HeaderParam("token") String token) {
        UserDto user = userbean.verifyToken(token);
        if (user == null) {
            logger.error("Invalid token from user {}", user.getUsername());
            return Response.status(401).entity("Invalid token").build();
        } else {
            logger.info("User information retrieved from user {}", user.getUsername());
            return Response.status(200).entity(user).build();
        }
    }

    @POST
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(@HeaderParam("token") String token, UserDto userDto) {
        if (!userDto.isValid()) {
            logger.error("Invalid data - missing params - Registering user");
            return Response.status(400).entity("Invalid data").build();
        } else {
            if (!userbean.checkIfTokenValid(token)) {
                logger.error("Invalid token from user {}", userDto.getUsername());
                return Response.status(401).entity("Invalid token").build();
            } else {
                if (userbean.updateUser(token, userDto)) {
                    logger.info("User {} updated successful", userDto.getUsername());
                    return Response.status(200).entity("Updated user " + userDto.getUsername() + " successfully").build();
                } else {
                    logger.error("User {} not updated", userDto.getUsername());
                    return Response.status(500).entity("User " + userDto.getUsername() + " not updated").build();
                }
            }
        }
    }

    @DELETE
    @Path("/delete")
    @Consumes(MediaType.TEXT_PLAIN)
    public Response deleteUser(@HeaderParam("token") String token, String usernameUserDelete) {
        if (usernameUserDelete.trim().equals("")) {
            logger.error("Invalid data - missing params - Deleting user");
            return Response.status(400).entity("Invalid data").build();
        } else {
            if (!userbean.checkIfTokenValid(token)) {
                logger.error("Invalid token when trying to delete user {}", usernameUserDelete);
                return Response.status(401).entity("Invalid token").build();
            } else {
                UserDto user = userbean.verifyToken(token);
                if (user == null) {
                    logger.error("Invalid token when trying to delete user {}", usernameUserDelete);
                    return Response.status(401).entity("Invalid token").build();
                } else {
                    if (!user.getAdmin()) {
                        logger.error("User {} tried to delete {} without admin permissions", user.getUsername(), usernameUserDelete);
                        return Response.status(403).entity("User does not have admin permission to delete other users").build();
                    } else {
                        usernameUserDelete = usernameUserDelete.trim();
                        if (!userbean.checkIfUserExists(usernameUserDelete)) {
                            logger.error("User {} tried to delete a user - {} - not found", user.getUsername(), usernameUserDelete);
                            return Response.status(404).entity("User " + user.getUsername() +" to delete not found").build();
                        } else {
                            if (userbean.deleteUser(usernameUserDelete)) {
                                logger.info("User {} deleted {} successfully", user.getUsername(), usernameUserDelete);
                                return Response.status(200).entity("Deleted user " + usernameUserDelete + " successfully").build();
                            } else {
                                logger.error("User {} not deleted due to exception", usernameUserDelete);
                                return Response.status(500).entity("User " + usernameUserDelete + " not deleted").build();
                            }
                        }
                    }
                }
            }
        }
    }


/*


    //para debug - a ser removido
    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserPojo> getUser() {
        return userbean.getUsersAplicationBean();
    }


    //Evaluations

    @GET
    @Path("/all/evaluations/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEvaluations(@PathParam("username") String username) {
        if (applicationBean.getAllEvaluations(username) != null) {
            return Response.status(200).entity(applicationBean.getAllEvaluations(username)).build();
        } else {
            return Response.status(400).entity("Failed").build();
        }
    }


    @POST
    @Path("/add/evaluation/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addEvaluation(@HeaderParam("username") String username, @HeaderParam("password") String password, Evaluation evaluation) {
        if (password.trim().equals("") || username.trim().equals("")) {
            return Response.status(401).entity("Parameters missing").build();
        } else if (!userbean.checkPassword(username, password)) {
            return Response.status(403).entity("Forbidden").build();
        } else {
            Evaluation newEvaluation = new Evaluation(evaluation.getStarNumber(), evaluation.getComment(), evaluation.getUserName(), evaluation.getSeller());
            if (applicationBean.addEvaluation( newEvaluation)) {
                return Response.status(200).entity("Evaluation added!").build();
            } else {
                return Response.status(400).entity("Failed").build();
            }
        }
    }

    @GET
    @Path("/evaluationsCounts/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEvaluationCounts(@PathParam("username") String username) {
        if (applicationBean.getEvaluationCounts(username) != null) {
            return Response.status(200).entity(applicationBean.getEvaluationCounts(username)).build();
        } else {
            return Response.status(400).entity("Failed").build();
        }
    }

    @POST
    @Path("/evaluation/edit/{id}/{seller}/{username}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response editEvaluation(@PathParam("id") int id, @PathParam("seller") String seller, @HeaderParam("username") String username, @HeaderParam("password") String password, Evaluation evaluation) {
        if (password.trim().equals("") || username.trim().equals("")) {
            return Response.status(401).entity("Parameters missing").build();
        } else if (!userbean.checkPassword(username, password)) {
            return Response.status(403).entity("Forbidden").build();
        } else {
            Evaluation evaluationToEdit = applicationBean.getEvaluationById(seller, id);
            if (evaluationToEdit == null) {
                return Response.status(404).entity("Evaluation not found!").build();
            } else if (!evaluationToEdit.getUserName().equals(username)) {
                return Response.status(403).entity("Forbidden").build();
            } else {
                evaluationToEdit.setComment(evaluation.getComment());
                evaluationToEdit.setStarNumber(evaluation.getStarNumber());
                evaluationToEdit.setDate(LocalDateTime.now());

                boolean updateSuccessful = applicationBean.updateEvaluation(id, seller, evaluationToEdit);
                if (updateSuccessful) {
                    return Response.status(200).entity("Evaluation updated!").build();
                } else {
                    return Response.status(400).entity("Evaluation not updated!").build();
                }
            }
        }
    }

    @DELETE
    @Path("/evaluation/delete/{id}/{seller}/{username}")
    public Response deleteEvaluation(@PathParam("id") int id, @PathParam("seller") String seller, @HeaderParam("username") String username, @HeaderParam("password") String password) {
        if (password.trim().equals("") || username.trim().equals("")) {
            return Response.status(401).entity("Parameters missing").build();
        } else if (!userbean.checkPassword(username, password)) {
            return Response.status(403).entity("Forbidden").build();
        } else {
            Evaluation evaluationToDelete = applicationBean.getEvaluationById(seller, id);
            if (evaluationToDelete == null) {
                return Response.status(404).entity("Evaluation not found!").build();
            } else if (!evaluationToDelete.getUserName().equals(username)) {
                return Response.status(403).entity("Forbidden").build();
            } else {

                boolean updateSuccessful = applicationBean.deleteEvaluation(id, seller);
                if (updateSuccessful) {
                    return Response.status(200).entity("Evaluation deleted!").build();
                } else {
                    return Response.status(400).entity("Evaluation not deleted!").build();
                }
            }
        }
    }

    //Produtos
    @GET
    @Path("/{username}/products")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProductsOfUser(@HeaderParam("username") String username, @HeaderParam("password") String password) {
        if (password.trim().equals("") || username.trim().equals("")) {
            return Response.status(401).entity("Parameters missing").build();
        } else if (!userbean.checkPassword(username, password)) {
            return Response.status(403).entity("Forbidden").build();
        } else {
            if (applicationBean.isUserExist(username)) {
                return Response.status(200).entity(applicationBean.getProductsUser(username)).build();
            } else {
                return Response.status(400).entity("User not found!").build();
            }
        }
    }
*/

    @POST
    @Path("/{username}/add")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addProduct(@HeaderParam("token") String token, @PathParam("username") String pathUsername, ProductDto newProductDto) {
        UserDto user = userbean.verifyToken(token);
        if (user == null) {
            logger.error("Invalid token - adding new product to {}", pathUsername);
            return Response.status(401).entity("Invalid token").build();
        } else {
            if (!newProductDto.newProductIsValid()) {
                logger.error("Invalid data - adding new product");
                return Response.status(400).entity("Invalid data").build();
            } else if (!user.getUsername().equals(pathUsername) && !user.getUsername().equals(newProductDto.getSeller())) {
                logger.error("Permission denied - {} adding new product to {}", user.getUsername(), pathUsername);
                return Response.status(403).entity("Permission denied").build();
            } else {
                userbean.addProduct(user, newProductDto);
                logger.info("Added new product to {}", pathUsername);
                return Response.status(200).entity("Added product").build();
            }
        }
    }
/*
    @POST
    @Path("/{username}/products/{ProductId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProduct(@HeaderParam("username") String username, @HeaderParam("password") String password, @PathParam("ProductId") int id, ProductDto
            product) {
        if (password.trim().equals("") || username.trim().equals("")) {
            return Response.status(401).entity("Parameters missing").build();
        } else if (userbean.checkPassword(username, password)) {
            ProductDto existingProduct = applicationBean.getProduct(id, username);
            if (existingProduct == null) {
                return Response.status(404).entity("Product not found!").build();
            }
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setCategory(product.getCategory());
            existingProduct.setLocation(product.getLocation());
            existingProduct.setUrlImage(product.getUrlImage());
            existingProduct.setState(product.getState());

            boolean updateSuccessful = applicationBean.updateProduct(existingProduct, username);
            if (updateSuccessful) {
                return Response.status(200).entity("Product updated!").build();
            } else {
                return Response.status(400).entity("Product not updated!").build();
            }
        } else {
            return Response.status(403).entity("Forbidden").build();
        }
    }


    @GET
    @Path("/products/{ProductId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProduct(@PathParam("ProductId") int id) {
        ProductDto existingProduct = applicationBean.getProduct(id);
        if (existingProduct == null) {
            return Response.status(404).entity("Product not found!").build();
        } else {
            return Response.status(200).entity(existingProduct).build();
        }
    }

    @POST
    @Path("/products/buy/{ProductId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buyProduct(@HeaderParam("username") String username, @HeaderParam("password") String password,@PathParam("ProductId") int id) {
        if (password.trim().equals("") || username.trim().equals("")) {
            return Response.status(401).entity("Parameters missing").build();
        } else if (!userbean.checkPassword(username, password)) {
            return Response.status(403).entity("Forbidden").build();
        } else {
            if (applicationBean.buyProduct(id)) {
                return Response.status(200).entity("Product sold!").build();
            } else {
                return Response.status(400).entity("Request Failed").build();
            }
        }
    }

    @DELETE
    @Path("/{username}/products/{ProductId}")
    public Response deleteProduct(@HeaderParam("username") String username, @HeaderParam("password") String password, @PathParam("ProductId") int id) {
        if (password.trim().equals("") || username.trim().equals("")) {
            return Response.status(401).entity("Parameters missing").build();
        } else if (!userbean.checkPassword(username, password)) {
            return Response.status(403).entity("Forbidden").build();
        } else {
            if (applicationBean.deleteProduct(id, username)) {
                return Response.status(200).entity("Product deleted!").build();
            }
            return Response.status(400).entity("Product not found!").build();
        }
    }*/
}