package pt.uc.dei.proj5.dto;

import java.time.LocalDateTime;

public class MessageDto {
    //Atributes
    private Long messageId;
    private String message;
    private Boolean isRead;
    private Boolean isDeleted;
    private LocalDateTime timestamp;
    private String sender;
    private String recipient;

    //Constructor
    //Empty Constructor
    public MessageDto() {
    }

    //Constuctor quando criada mensagem
    public MessageDto(String message, String sender, String recipient, LocalDateTime timestamp) {
        this.message = message;
        this.isRead = false;
        this.isDeleted = false;
        this.timestamp = timestamp;
        this.sender = sender;
        this.recipient = recipient;
        this.messageId = generateMessageHash(this.message, this.timestamp, this.sender, this.recipient);
    }

    public MessageDto(MessageDto messageDto) {
        this.message = messageDto.message;
        this.isRead = messageDto.isRead;
        this.isDeleted = messageDto.isDeleted;
        this.timestamp = messageDto.timestamp;
        this.sender = messageDto.sender;
        this.recipient = messageDto.recipient;
        this.messageId = generateMessageHash(this.message, this.timestamp, this.sender, this.recipient);
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

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    private Long generateMessageHash(String message, LocalDateTime dateSent, String senderUsername, String receiverUsername) {
        long hash = 0L;
        String string = message.concat(dateSent.toString()).concat(senderUsername).concat(receiverUsername);

        for (int i = 0; i < string.length(); i++) {
            int chr = Character.codePointAt(string, i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0L;
        }

        return hash;
    }

}
