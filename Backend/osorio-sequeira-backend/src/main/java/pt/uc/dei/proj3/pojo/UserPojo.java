package pt.uc.dei.proj3.pojo;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Objects;

public class UserPojo implements Serializable {
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String url;
    private ArrayList<ProductPojo> productPojos;
    private EvaluationCounts evaluationCounts;
    private ArrayList <Evaluation> evaluations;


    public UserPojo(String firstName, String lastName, String username, String password, String email, String phoneNumber, String url, ArrayList<ProductPojo> productPojos) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.url = url;
        this.productPojos = productPojos;
    }

    public UserPojo(String firstName, String lastName, String username, String password, String email, String phoneNumber, String url) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.url = url;
        evaluationCounts = new EvaluationCounts();
    }

    //Construtor para conversão de Pojo para Dto
    public UserPojo(String firstName, String lastName, String username, String password, String email, String phoneNumber, String url, ArrayList<ProductPojo> productPojo, ArrayList<Evaluation> evaluations, EvaluationCounts ratings) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.url = url;
        this.productPojos = productPojo;
        this.evaluations = evaluations;
        this.evaluationCounts = ratings;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public EvaluationCounts getEvaluationCounts() {
        return evaluationCounts;
    }

    public boolean addEvaluationUserPojo(Evaluation evaluation) {
        if(this.evaluations!=null && evaluation!=null ) {
            evaluations.add(evaluation);
            if(evaluationCounts!=null) {
                evaluationCounts.setStarsAfterAdd(evaluations);
                return true;
            }else{
                evaluationCounts=new EvaluationCounts(evaluations);
                return true;
            }
        } else if (this.evaluations==null && evaluation!=null ) {
            evaluations=new ArrayList<Evaluation>();
            evaluations.add(evaluation);
            if(evaluationCounts!=null) {
                evaluationCounts.setStarsAfterAdd(evaluations);
                return true;
            }else{
                evaluationCounts=new EvaluationCounts(evaluations);
                return true;
            }
        }else{
            return false;
        }
    }

    public ArrayList<Evaluation> getEvaluations() {
        return evaluations;
    }

    public Evaluation getEvaluation(int id) {
        for(Evaluation evaluation : evaluations) {
            if(evaluation.getEvaluationId()==id){
                return evaluation;
            }
        }
        return null;
    }

    public boolean updateEvaluation(int id, Evaluation evaluation) {
        for(Evaluation editEvaluation : evaluations) {
            if(editEvaluation.getEvaluationId()==id){
                editEvaluation.setComment(evaluation.getComment());
                editEvaluation.setStarNumber(evaluation.getStarNumber());
                editEvaluation.setDate(LocalDateTime.now());
                evaluationCounts.setStarsAfterAdd(evaluations);
                return true;
            }
        }
        return false;
    }

    public boolean deleteEvaluation(int id) {
        for(Evaluation evaluation : evaluations) {
            if (evaluation.getEvaluationId()==id) {
                this.evaluations.remove(evaluation);
                evaluationCounts.setStarsAfterAdd(evaluations);
                return true;
            }
        }
        return false;
    }

    public ArrayList<ProductPojo> getProductPojos() {
        return productPojos;
    }

    public boolean updateProductPojo(ProductPojo productPojo) {
        for (ProductPojo p : this.productPojos) {
            if (Objects.equals(productPojo.getId(), p.getId())){
                p.setName(productPojo.getName());
                p.setPrice(productPojo.getPrice());
                p.setCategory(productPojo.getCategory());
                p.setDescription(productPojo.getDescription());
                p.setLocation(productPojo.getLocation());
                p.setState(productPojo.getState());
                p.setUrlImage(productPojo.getUrlImage());
                return true;
            }
        }
        return false;
    }

    public boolean addProductPojo(ProductPojo productPojo) {
        if(this.productPojos==null){
            this.productPojos=new ArrayList<>();
            this.productPojos.add(productPojo);
            return true;
        }else if(this.productPojos!=null){
            this.productPojos.add(productPojo);
            return true;
        } else {
            return false;
        }
    }

    public boolean deleteProductPojo(ProductPojo productPojo) {
        this.productPojos.remove(productPojo);
        return true;
    }


}
