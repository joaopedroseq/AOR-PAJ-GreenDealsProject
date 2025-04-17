package pt.uc.dei.proj5.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@NamedQuery(
        name = "MessageEntity.getMessageNotifications",
        query = "SELECT m.sender.username, COUNT(m), MAX(m.timestamp), u.url " +
                "FROM MessageEntity m " +
                "JOIN UserEntity u ON m.sender.username = u.username " +
                "WHERE m.recipient.username = :recipient_username AND m.isRead = false " +
                "GROUP BY m.sender, u.url " +
                "ORDER BY MAX(m.timestamp) DESC"
)
@Entity
@Table(name="message")
public class MessageEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name="messageId", nullable = false, unique = true, updatable = false)
    private int messageId;

    @Column(name="message", nullable = false, unique = false, updatable = true)
    private String message;

    @Column(name="isRead", nullable = false, unique = false, updatable = true)
    private Boolean isRead;

    @Column(name="isDeleted", nullable = false, unique = false, updatable = true)
    private Boolean isDeleted;

    @Column(name="timestamp", nullable = false, unique = false, updatable = false)
    private LocalDateTime timestamp;

    @Column(name="dateEdited", nullable = true, unique = false, updatable = false)
    private LocalDateTime dateEdited;

    @ManyToOne
    private UserEntity sender;

    @ManyToOne
    private UserEntity recipient;

    //Constructor
    //Empty constructor
    public MessageEntity() {
    }

    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getRead() {
        return isRead;
    }

    public void setRead(Boolean read) {
        isRead = read;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public UserEntity getSender() {
        return sender;
    }

    public void setSender(UserEntity sender) {
        this.sender = sender;
    }

    public UserEntity getRecipient() {
        return recipient;
    }

    public void setRecipient(UserEntity receiver) {
        this.recipient = receiver;
    }

    public LocalDateTime getDateEdited() {
        return dateEdited;
    }

    public void setDateEdited(LocalDateTime dateEdited) {
        this.dateEdited = dateEdited;
    }
}
