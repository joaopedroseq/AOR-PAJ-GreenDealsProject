package pt.uc.dei.proj5.dto;

import java.time.LocalDateTime;

public class MessageNotificationDto {
    private String senderUsername;
    private String senderPhoto;
    private int unreadCount;
    private LocalDateTime latestMessageTimestamp;

    public MessageNotificationDto(String sender, Long unreadCount, LocalDateTime latestMessageTimestamp, String senderPhoto) {
        this.senderUsername = sender; // Extract username from entity
        this.senderPhoto = senderPhoto;
        this.unreadCount = unreadCount.intValue();
        this.latestMessageTimestamp = latestMessageTimestamp;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getSenderPhoto() {
        return senderPhoto;
    }

    public void setSenderPhoto(String senderPhoto) {
        this.senderPhoto = senderPhoto;
    }

    public int getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(int unreadCount) {
        this.unreadCount = unreadCount;
    }

    public LocalDateTime getLatestMessageTimestamp() {
        return latestMessageTimestamp;
    }

    public void setLatestMessageTimestamp(LocalDateTime latestMessageTimestamp) {
        this.latestMessageTimestamp = latestMessageTimestamp;
    }

    @Override
    public String toString() {
        return "MessageNotificationDto{" +
                "senderUsername='" + senderUsername + '\'' +
                ", unreadCount=" + unreadCount +
                ", latestMessageTimestamp=" + latestMessageTimestamp +
                '}';
    }
}
