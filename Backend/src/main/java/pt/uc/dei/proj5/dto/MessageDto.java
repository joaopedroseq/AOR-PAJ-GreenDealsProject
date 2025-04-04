package pt.uc.dei.proj5.dto;

import java.time.LocalDateTime;

public class MessageDto {
    //Atributes
    private int messageId;
    private String message;
    private Boolean isRead;
    private Boolean isDeleted;
    private LocalDateTime dateSent;
    private String senderUsername;
    private String receiverUsername;

    //Constructor
    //Empty Constructor
    public MessageDto() {
    }

    //Constuctor quando criada mensagem
    public MessageDto(String message, String senderUsername, String receiverUsername) {
        this.message = message;
        this.isRead = false;
        this.isDeleted = false;
        this.dateSent = LocalDateTime.now();
        this.senderUsername = senderUsername;
        this.receiverUsername = receiverUsername;
        this.messageId = generateMessageHash(this.message, this.dateSent, this.senderUsername, this.receiverUsername);
    }

    public MessageDto(MessageDto messageDto) {
        this.message = messageDto.message;
        this.isRead = messageDto.isRead;
        this.isDeleted = messageDto.isDeleted;
        this.dateSent = messageDto.dateSent;
        this.senderUsername = messageDto.senderUsername;
        this.receiverUsername = messageDto.receiverUsername;
        this.messageId = generateMessageHash(this.message, this.dateSent, this.senderUsername, this.receiverUsername);
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
