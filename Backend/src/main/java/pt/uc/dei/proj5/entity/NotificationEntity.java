package pt.uc.dei.proj5.entity;

import jakarta.persistence.*;
import pt.uc.dei.proj5.dto.NotificationType;

import java.io.Serializable;
import java.time.LocalDateTime;

@NamedQuery(
        name = "NotificationEntity.getNotifications",
        query = "SELECT n " +
                "FROM NotificationEntity n " +
                "JOIN FETCH n.sender " +
                "WHERE n.recipient.username = :username")

@NamedQuery(
        name = "NotificationEntity.readNotification",
        query = "UPDATE NotificationEntity n " +
                "SET isRead = true " +
                "WHERE n.recipient.username = :recipientUsername " +
                "AND n.id = :notificationId")

@NamedQuery(
        name = "NotificationEntity.checkIfNotificationExist",
        query = "SELECT COUNT(n) " +
                "FROM NotificationEntity n " +
                "WHERE n.recipient.username = :recipientUsername " +
                "AND n.id = :notificationId")

@NamedQuery(
        name = "NotificationEntity.isRecipientNotified",
        query = "SELECT COUNT(n) " +
                "FROM NotificationEntity n " +
                "WHERE n.recipient.username = :recipientUsername " +
                "AND n.sender.username = :senderUsername " +
                "AND n.type = 'MESSAGE' " +
                "AND n.isRead = false")

@NamedQuery(
        name = "NotificationEntity.updateMessageNotification",
        query = "UPDATE NotificationEntity n " +
                "SET n.messageCount = n.messageCount + 1, " +
                "n.timestamp = :newDate " +
                "WHERE n.recipient.username = :recipientUsername " +
                "AND n.sender.username = :senderUsername " +
                "AND n.type = 'MESSAGE'"
)
@Entity
@Table(name = "notification")
public class NotificationEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private UserEntity recipient; // User receiving the notification

    @ManyToOne
    private UserEntity sender; // User triggering the notification (for messages or purchases)

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, unique = false, updatable = true)
    private NotificationType type;  // "MESSAGE" or "PRODUCT_PURCHASE"

    @Column(name = "content", nullable = false, unique = false, updatable = true)
    private String content;  // Message summary or purchase details

    @Column(name = "isRead", nullable = false, unique = false, updatable = true)
    private boolean isRead;

    @Column(name = "timestamp", nullable = false, unique = false, updatable = true)
    private LocalDateTime timestamp;

    @Column(name = "messageCount", nullable = true)
    private Integer messageCount;  // Null for non-message notifications

    public NotificationEntity(Long id, UserEntity recipient, UserEntity sender, NotificationType type, String content, boolean isRead, LocalDateTime timestamp) {
        this.id = id;
        this.recipient = recipient;
        this.sender = sender;
        this.type = type;
        this.content = content;
        this.isRead = isRead;
        this.timestamp = timestamp;
    }

    public NotificationEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getRecipient() {
        return recipient;
    }

    public void setRecipient(UserEntity recipient) {
        this.recipient = recipient;
    }

    public UserEntity getSender() {
        return sender;
    }

    public void setSender(UserEntity sender) {
        this.sender = sender;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getMessageCount() {
        return messageCount;
    }

    public void setMessageCount(Integer messageCount) {
        this.messageCount = messageCount;
    }
}