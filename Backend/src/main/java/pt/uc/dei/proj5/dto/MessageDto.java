package pt.uc.dei.proj5.dto;

import jakarta.json.JsonObject;

import java.time.LocalDateTime;

public class MessageDto {
    //Atributes
    private int messageId;
    private String message;
    private Boolean isRead;
    private Boolean isDeleted;
    private LocalDateTime timestamp;
    private String sender;
    private String receiver;

    //Constructor
    //Empty Constructor
    public MessageDto() {
    }

    //Constuctor quando criada mensagem
    public MessageDto(String message, String sender, String receiver, LocalDateTime timestamp) {
        this.message = message;
        this.isRead = false;
        this.isDeleted = false;
        this.timestamp = timestamp;
        this.sender = sender;
        this.receiver = receiver;
        this.messageId = generateMessageHash(this.message, this.timestamp, this.sender, this.receiver);
    }

    public MessageDto(MessageDto messageDto) {
        this.message = messageDto.message;
        this.isRead = messageDto.isRead;
        this.isDeleted = messageDto.isDeleted;
        this.timestamp = messageDto.timestamp;
        this.sender = messageDto.sender;
        this.receiver = messageDto.receiver;
        this.messageId = generateMessageHash(this.message, this.timestamp, this.sender, this.receiver);
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

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    private Integer generateMessageHash(String message, LocalDateTime dateSent, String senderUsername, String receiverUsername) {
        int hash = 0;
        String string = message.concat(dateSent.toString()).concat(senderUsername).concat(receiverUsername);
        for (int i = 0; i < string.length(); i++) {
            int chr = Character.codePointAt(string, i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

}
