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

@NamedQuery(
        name = "MessageEntity.getUnreadMessages",
        query = "SELECT COUNT(m) " +
                "FROM MessageEntity m " +
                "WHERE m.recipient.username = :recipient_username " +
                "AND m.sender.username = :sender_username " +
                "AND m.isRead = false"
)

@NamedQuery(
        name = "MessageEntity.getConversation",
        query = "SELECT m " +
                "FROM MessageEntity m " +
                "WHERE (m.recipient.username = :user_username AND m.sender.username = :otherUser_username) " +
                "OR (m.recipient.username = :otherUser_username AND m.sender.username = :user_username) " +
                "ORDER BY m.timestamp ASC"
)

@NamedQuery(
        name = "MessageEntity.getAllChats",
        query = "SELECT DISTINCT u.username, u.url " +
                "FROM MessageEntity m " +
                "JOIN UserEntity u ON (u.username = m.sender.username OR u.username = m.recipient.username) " +
                "WHERE (m.recipient.username = :user_username OR m.sender.username = :user_username) " +
                "AND u.username != :user_username " + // Exclude the current user
                "ORDER BY u.username ASC"
)
@Entity
@Table(name="message", indexes = {
        @Index(name = "idx_recipient_sender_unread", columnList = "recipient, sender, isRead"),
        @Index(name = "idx_conversation_pair", columnList = "recipient, sender, timestamp"),
})
public class MessageEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name="id", nullable = false, unique = true, updatable = false)
    private Long messageId;

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
    @JoinColumn(name = "sender", nullable = false)
    private UserEntity sender;

    @ManyToOne
    @JoinColumn(name = "recipient", nullable = false)
    private UserEntity recipient;

    //Constructor
    //Empty constructor
    public MessageEntity() {
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
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
