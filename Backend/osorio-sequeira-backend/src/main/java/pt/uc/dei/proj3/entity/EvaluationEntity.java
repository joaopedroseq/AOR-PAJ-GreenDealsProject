package pt.uc.dei.proj3.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name="evaluation")
public class EvaluationEntity implements Serializable {

    @Id
    @Column(name="evaluationId")
    private int evaluationId;

    @Column(name="starNumber")
    private int starNumber;

    @Column(name="comment")
    private String comment;

    @Column(name="evalDate")
    private LocalDateTime date;

    @ManyToOne
    private UserEntity username;

    @ManyToOne
    private UserEntity seller;

    //Constructors
    //Empty constructor
    public EvaluationEntity() {}

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public int getEvaluationId() {
        return evaluationId;
    }

    public void setEvaluationId(int evaluationId) {
        this.evaluationId = evaluationId;
    }



    public int getStarNumber() {
        return starNumber;
    }

    public void setStarNumber(int starNumber) {
        this.starNumber = starNumber;
    }


}
