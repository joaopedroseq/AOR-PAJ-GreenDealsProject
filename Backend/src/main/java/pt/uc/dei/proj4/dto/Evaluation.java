package pt.uc.dei.proj4.dto;

import java.time.LocalDateTime;

public class Evaluation {
    private int starNumber;
    private String comment;
    private String userName;
    private String seller;
    private LocalDateTime date;
    private int evaluationId;


    //Construtor para carregamento do ficheiro
    public Evaluation(int starNumber, String comment, String userName, String seller, LocalDateTime date, int evaluationId) {
        this.starNumber = starNumber;
        this.comment = comment;
        this.userName = userName;
        this.seller = seller;
        this.date = date;
        this.evaluationId = evaluationId;
    }

    public Evaluation() {
        this.date=LocalDateTime.now();
    }

    public Evaluation(int starNumber, String comment, String userName, String seller) {
        this.starNumber = starNumber;
        this.comment = comment;
        this.userName = userName;
        this.seller = seller;
        this.date = LocalDateTime.now();
        this.evaluationId = generateHash(starNumber, comment, userName, seller, date);
    }

    public int getStarNumber() {
        return starNumber;
    }

    public void setStarNumber(int starNumber) {
        this.starNumber = starNumber;
    }

    public String getComment() {
        return comment;
    }

    public String getSeller() {
        return seller;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setSeller(String seller) {
        this.seller = seller;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getEvaluationId() {
        return evaluationId;
    }

    public void setEvaluationId(int evaluationId) {
        this.evaluationId = evaluationId;
    }

    private Integer generateHash(int starNumber, String comment, String userName, String seller, LocalDateTime date) {
        int hash = 0;
        String string = String.valueOf(starNumber).concat(comment).concat(userName).concat(seller).concat(date.toString());
        for (int i = 0; i < string.length(); i++) {
            int chr = Character.codePointAt(string, i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    //todo evaluation isValid() method
}
