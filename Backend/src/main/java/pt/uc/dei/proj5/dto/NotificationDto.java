package pt.uc.dei.proj5.dto;

import java.time.LocalDateTime;

public class NotificationDto {
    private Long id;
    private NotificationType type;
    private String content;
    private boolean isRead;
    private LocalDateTime timestamp;
    private String recipientUsername;
    private String senderUsername;
    private String senderProfileUrl; // New field
    private Integer messageCount;

    public NotificationDto(Long id, NotificationType type, String content, boolean isRead, LocalDateTime timestamp, String recipientUsername, String senderUsername, String senderProfileUrl, int messageCount) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.isRead = isRead;
        this.timestamp = timestamp;
        this.recipientUsername = recipientUsername;
        this.senderUsername = senderUsername;
        this.senderProfileUrl = senderProfileUrl;
        this.messageCount = messageCount;
    }

    public NotificationDto() {
    }

    public String getRecipientUsername() {
        return recipientUsername;
    }

    public void setRecipientUsername(String recipientUsername) {
        this.recipientUsername = recipientUsername;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getSenderProfileUrl() {
        return senderProfileUrl;
    }

    public void setSenderProfileUrl(String senderProfileUrl) {
        this.senderProfileUrl = senderProfileUrl;
    }

    public Integer getMessageCount() {
        return messageCount;
    }

    public void setMessageCount(Integer messageCount) {
        this.messageCount = messageCount;
    }
}
